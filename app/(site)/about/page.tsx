import Image from "next/image";
import { Mail } from "lucide-react";

export default function AboutPage() {
  return (
		<div
			className="min-h-screen flex items-center justify-center pt-20"
			style={{
				backgroundColor: "var(--ce-bg)",
				fontFamily: "'Inter', sans-serif",
			}}
		>
			<div className="max-w-2xl mx-auto px-6 py-20 text-center">
				<div
					className="relative w-40 h-40 rounded-full overflow-hidden mb-6 mx-auto"
					style={{
						border: "4px solid #FFC72C",
						boxShadow: "0 8px 32px rgba(255,199,44,0.3)",
					}}
				>
					<Image
						src="/images/About.png"
						alt="Chizzy"
						fill
						sizes="160px"
						className="object-cover"
						priority
					/>
				</div>
				<h1
					style={{
						fontFamily: "'Dancing Script', cursive",
						fontSize: "clamp(32px, 5vw, 52px)",
						color: "var(--ce-text)",
						fontWeight: 800,
						marginBottom: "16px",
					}}
				>
					About Chizzy Eats
				</h1>
				<p
					className="text-base leading-relaxed mb-6"
					style={{ color: "var(--ce-text-muted)" }}
				>
					Hi there! I'm Chizzy — a Nigerian food lover, home cook, and
					recipe developer. I started this blog to share the flavours that
					shaped my childhood and the dishes I've fallen in love with from
					around the world.
				</p>
				<p
					className="text-base leading-relaxed"
					style={{ color: "var(--ce-text-muted)" }}
				>
					Every recipe on Chizzy Eats is tested multiple times in my home
					kitchen. I believe good food should be accessible, delicious, and
					made with love — whether it's a 10-minute smoothie or a
					slow-cooked seafood stew.
				</p>
				<div className="mt-8 flex items-center justify-center gap-2">
					<Mail size={16} style={{ color: "#FF8C42" }} />
					<a
						href="mailto:chizobaezeh24@gmail.com"
						className="text-sm"
						style={{ color: "#FF8C42", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}
					>
						chizobaezeh24@gmail.com
					</a>
				</div>
			</div>
		</div>
  );
}
