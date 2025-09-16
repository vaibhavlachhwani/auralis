import { SiteHeader } from "@/components/site-header/SiteHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VaibhavLogo } from "@/components/logo/VaibhavLogo";
import {
  Heart,
  BarChart3,
  Network,
  Gauge,
  Cable,
  Eye,
  Palette,
} from "lucide-react";

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
      <div className="bg-primary/10 text-primary p-3 rounded-full">{icon}</div>
      <div>
        <CardTitle>{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export function AboutPage() {
  return (
    <>
      <header>
        <SiteHeader title="About Auralis" />
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Welcome to Auralis</h1>
            <p className="text-muted-foreground text-lg mt-2">
              Your window into the world of network traffic.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>The Auralis Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                It all started with a simple, frustrating question that many of
                us have asked: "Why is my internet so slow right now?" My home
                network, once a simple setup, had evolved into a complex
                ecosystem of laptops, phones, smart TVs, and a dozen other IoT
                devices. One evening, everything ground to a halt. A critical
                file download was crawling, video calls were dropping, and
                online games were unplayable. The culprit was a mystery.
              </p>
              <p>
                My first instinct was to dive into command-line tools. I spent
                hours trying to piece together data from <code>ping</code>,
                <code> traceroute</code>, and <code>netstat</code>, but all I
                got were fragmented clues, not a clear picture. I felt like I
                was trying to solve a puzzle in the dark. On the other end of
                the spectrum were the enterprise-grade network monitoring
                solutions—powerful, but overwhelmingly complex and prohibitively
                expensive for a home or small business environment. They
                required dedicated servers, complex configurations, and a manual
                thick enough to be a doorstop.
              </p>
              <p>
                This experience sparked an idea: What if there was a better way?
                What if you could have the power of a professional tool with the
                simplicity of a consumer app? What if you could visualize your
                network's activity as easily as checking the weather?
              </p>
              <p className="text-foreground font-medium">
                That's why Auralis was born. The journey to create it was driven
                by a passion for elegant design and a belief that powerful
                technology should be accessible to everyone. The goal was to
                create a tool that transforms the cryptic, chaotic stream of
                network data into a clear, visual, and actionable narrative.
              </p>
              <p className="text-foreground font-medium">
                Auralis is more than just a monitoring tool; it's a window into
                your network's soul. Whether you're a developer debugging a
                distributed application, a small business owner ensuring a
                stable connection for your team, or a tech enthusiast curious
                about the data flowing through your home, Auralis gives you the
                power to see, understand, and take control of your digital
                environment. We believe that with the right insights, anyone can
                become the master of their network.
              </p>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold text-center mb-6">
              Key Features
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Gauge className="size-6" />}
                title="Real-Time Metrics"
                description="Monitor live bandwidth, packets per second, and other key performance indicators at a glance."
              />
              <FeatureCard
                icon={<BarChart3 className="size-6" />}
                title="Interactive Charts"
                description="Visualize network data with dynamic, easy-to-understand charts for bandwidth, protocol distribution, and more."
              />
              <FeatureCard
                icon={<Network className="size-6" />}
                title="Top Traffic Analysis"
                description="Instantly identify the top talkers, destinations, and services consuming bandwidth on your network."
              />
              <FeatureCard
                icon={<Cable className="size-6" />}
                title="Detailed Connection Info"
                description="Inspect a comprehensive table of active network connections, including IPs, ports, and data volume."
              />
              <FeatureCard
                icon={<Eye className="size-6" />}
                title="Responsive Design"
                description="Auralis is designed to work seamlessly across devices, from large desktop monitors to tablets."
              />
              <FeatureCard
                icon={<Palette className="size-6" />}
                title="Light & Dark Mode"
                description="Seamlessly switch between light and dark themes for your viewing comfort."
              />
            </div>
          </div>

          <div className="text-center text-muted-foreground py-6">
            <div className="flex items-center justify-center gap-2">
              <span>Made with</span>
              <Heart className="size-5 text-red-500 fill-red-500" />
              <span>by</span>
              <a
                href="https://www.vaibhavlachhwani.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <VaibhavLogo width={24} height={24} />
                <span>Vaibhav Lachhwani</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
