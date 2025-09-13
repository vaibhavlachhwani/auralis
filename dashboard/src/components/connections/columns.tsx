import type { ConnectionData } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { formatBitsPerSecond, formatBytes } from "@/utils/formatters";

export const columns: ColumnDef<ConnectionData>[] = [
  {
    accessorKey: "sourceIp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source IP" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.getValue("sourceIp")}
      </div>
    ),
  },
  {
    accessorKey: "sourcePort",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source Port" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.getValue("sourcePort")}
      </div>
    ),
  },
  {
    accessorKey: "destinationIp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Destination IP" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.getValue("destinationIp")}
      </div>
    ),
  },
  {
    accessorKey: "destinationPort",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Destination Port" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.getValue("destinationPort")}
      </div>
    ),
  },
  {
    accessorKey: "protocol",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Protocol" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.getValue("protocol")}
      </div>
    ),
  },
  {
    accessorKey: "bytes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Volume" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {formatBytes(row.getValue("bytes"))}
      </div>
    ),
  },
  {
    accessorKey: "speedMbps",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Live Speed" />
    ),
    cell: ({ row }) => {
      const speed = row.getValue("speedMbps") as number;
      return (
        <div className="flex items-center justify-center">
          {formatBitsPerSecond(speed * 1_000_000)}
        </div>
      );
    },
  },
];
