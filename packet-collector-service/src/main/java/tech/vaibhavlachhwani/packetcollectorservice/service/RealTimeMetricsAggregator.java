package tech.vaibhavlachhwani.packetcollectorservice.service;

import org.springframework.stereotype.Service;
import tech.vaibhavlachhwani.packetcollectorservice.dto.AggregatedData;
import tech.vaibhavlachhwani.packetcollectorservice.dto.PacketMetrics;
import tech.vaibhavlachhwani.packetcollectorservice.dto.TcpFlags;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class RealTimeMetricsAggregator {

    // General Metrics
    private final AtomicLong totalBytes = new AtomicLong(0);
    private final AtomicLong totalPackets = new AtomicLong(0);

    // Protocol Distribution
    private ConcurrentHashMap<String, AtomicLong> bytesPerProtocol = new ConcurrentHashMap<>();

    // TCP Metrics
    private final AtomicLong newConnectionAttemptCount = new AtomicLong(0);
    private final AtomicLong connectionResetCount = new AtomicLong(0);

    // Top Talkers
    private ConcurrentHashMap<String, AtomicLong> bytesBySourceIp = new ConcurrentHashMap<>();
    private ConcurrentHashMap<String, AtomicLong> bytesByDestinationIp = new ConcurrentHashMap<>();

    // Top Services
    private ConcurrentHashMap<Integer, AtomicLong> bytesPerDestinationPort = new ConcurrentHashMap<>();

    //Connection info
    private ConcurrentHashMap<String, AtomicLong> bytesPerConnection = new ConcurrentHashMap<>();

    public void processPacket(PacketMetrics packetMetrics) {
        totalBytes.addAndGet(packetMetrics.getPacketLength());
        totalPackets.incrementAndGet();

        if (packetMetrics.getProtocol() != null) {
            bytesPerProtocol.computeIfAbsent(packetMetrics.getProtocol(), k -> new AtomicLong(0))
                    .addAndGet(packetMetrics.getPacketLength());
        }

        TcpFlags flags = packetMetrics.getTcpFlags();
        if (flags != null) {
            if (packetMetrics.getTcpFlags().getSyn() != null &&
                    packetMetrics.getTcpFlags().getAck() != null &&
                    (packetMetrics.getTcpFlags().getSyn() && !packetMetrics.getTcpFlags().getAck())) {
                newConnectionAttemptCount.incrementAndGet();
            }

            if (packetMetrics.getTcpFlags().getRst() != null &&
                    packetMetrics.getTcpFlags().getRst()) {
                connectionResetCount.incrementAndGet();
            }
        }

        if (packetMetrics.getSourceIp() != null) {
            bytesBySourceIp.computeIfAbsent(packetMetrics.getSourceIp(), k -> new AtomicLong(0))
                    .addAndGet(packetMetrics.getPacketLength());
        }

        if (packetMetrics.getDestinationIp() != null) {
            bytesByDestinationIp.computeIfAbsent(packetMetrics.getDestinationIp(), k -> new AtomicLong(0))
                    .addAndGet(packetMetrics.getPacketLength());
        }

        if (packetMetrics.getDestinationPort() != null) {
            bytesPerDestinationPort.computeIfAbsent(packetMetrics.getDestinationPort(), k -> new AtomicLong(0))
                    .addAndGet(packetMetrics.getPacketLength());
        }

        if (packetMetrics.getSourceIp() != null && packetMetrics.getSourcePort() != null &&
                packetMetrics.getDestinationIp() != null && packetMetrics.getDestinationPort() != null &&
                packetMetrics.getProtocol() != null) {

            String connectionId = createConnectionId(
                    packetMetrics.getSourceIp(),
                    packetMetrics.getSourcePort(),
                    packetMetrics.getDestinationIp(),
                    packetMetrics.getDestinationPort(),
                    packetMetrics.getProtocol()
            );

            bytesPerConnection.computeIfAbsent(connectionId, k -> new AtomicLong(0))
                    .addAndGet(packetMetrics.getPacketLength());
        }
    }

    public synchronized AggregatedData snapshotAndReset() {
        Map<String, AtomicLong> oldBytesPerProtocol = bytesPerProtocol;
        bytesPerProtocol = new ConcurrentHashMap<>();

        Map<String, AtomicLong> oldBytesBySourceIp = bytesBySourceIp;
        bytesBySourceIp = new ConcurrentHashMap<>();

        Map<String, AtomicLong> oldBytesByDestinationIp = bytesByDestinationIp;
        bytesByDestinationIp = new ConcurrentHashMap<>();

        Map<Integer, AtomicLong> oldBytesPerDestinationPort = bytesPerDestinationPort;
        bytesPerDestinationPort = new ConcurrentHashMap<>();

        Map<String, AtomicLong> oldBytesPerConnection = bytesPerConnection;
        bytesPerConnection = new ConcurrentHashMap<>();

        return AggregatedData.builder()
                .totalBytes(totalBytes.getAndSet(0))
                .totalPackets(totalPackets.getAndSet(0))
                .newConnectionAttemptCount(newConnectionAttemptCount.getAndSet(0))
                .connectionResetCount(connectionResetCount.getAndSet(0))
                .bytesPerProtocol(
                        oldBytesPerProtocol.entrySet().stream()
                                .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().get()))
                )
                .bytesBySourceIp(
                        oldBytesBySourceIp.entrySet().stream()
                                .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().get()))
                )
                .bytesByDestinationIp(
                        oldBytesByDestinationIp.entrySet().stream()
                                .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().get()))
                )
                .bytesPerDestinationPort(
                        oldBytesPerDestinationPort.entrySet().stream()
                                .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().get()))
                )
                .bytesPerConnection(
                        oldBytesPerConnection.entrySet().stream()
                                .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().get()))
                )
                .build();
    }

    private String createConnectionId(String sip, int sp, String dip, int dp, String proto) {
        if (sip.compareTo(dip) > 0 || (sip.equals(dip) && sp > dp)) {
            return dip + ":" + dp + "-" + sip + ":" + sp + "-" + proto;
        }

        return sip + ":" + sp + "-" + dip + ":" + dp + "-" + proto;
    }
}
