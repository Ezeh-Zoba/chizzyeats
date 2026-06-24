import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function AboutChizzySection() {
  return (
		<section
			className="py-16 lg:py-24"
			style={{ backgroundColor: "var(--ce-bg)" }}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<div className="relative">
						<div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
							<Image
								src="/images/About.png"
								alt="Chizzy cooking"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
						<div
							className="absolute -bottom-4 -right-4 px-5 py-4 rounded-2xl"
							style={{
								backgroundColor: "#FFC72C",
								boxShadow: "0 8px 32px rgba(255,199,44,0.3)",
							}}
						>
							<div
								style={{
									fontFamily: "'Dancing Script', cursive",
									fontSize: "32px",
									fontWeight: 800,
									color: "#5C4033",
									lineHeight: 1,
								}}
							>
								2+
							</div>
							<div
								className="text-xs mt-0.5"
								style={{ color: "var(--ce-text)", fontWeight: 600 }}
							>
								Years cooking
							</div>
						</div>
					</div>

					<div>
						<p
							className="text-xs mb-3 uppercase tracking-widest"
							style={{ color: "#FF8C42", fontWeight: 600 }}
						>
							Meet the Chef
						</p>
						<h2
							className="mb-5"
							style={{
								fontFamily: "'Dancing Script', cursive",
								fontSize: "clamp(28px, 4vw, 42px)",
								color: "var(--ce-text)",
								fontWeight: 700,
								lineHeight: 1.2,
							}}
						>
							Hi, I'm Chizzy — Your Kitchen Companion
						</h2>
						<p
							className="mb-4 leading-relaxed"
							style={{ color: "var(--ce-text-muted)" }}
						>
							Born and raised with a deep love for Nigerian cuisine, I've
							spent years perfecting the recipes that make our tables
							come alive — jollof rice that hits just right, egusi that
							warms the soul, and desserts that make people ask for
							seconds.
						</p>
						<p
							className="mb-8 leading-relaxed"
							style={{ color: "var(--ce-text-muted)" }}
						>
							This blog is my love letter to food — from quick weeknight
							dinners to show-stopping celebration dishes. Everything is
							tested in my home kitchen and made with real ingredients
							you can find anywhere.
						</p>
						<Link
							href="/about"
							className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm transition-all duration-200"
							style={{
								background: "linear-gradient(135deg, #FFC72C, #FF8C42)",
								color: "#5C4033",
								fontWeight: 700,
								boxShadow: "0 4px 16px rgba(255,199,44,0.3)",
							}}
						>
							Read My Story <ArrowRight size={16} />
						</Link>
					</div>
				</div>
			</div>
		</section>
  );
}
