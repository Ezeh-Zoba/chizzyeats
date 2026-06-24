"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Flame } from "lucide-react";
import { useHomeStats } from "@/hooks/useHomeStats";
import { HERO_SLIDES } from "@/lib/hero-data";

const SLIDE_INTERVAL_MS = 5000;

export function HeroSection() {
	const [active, setActive] = useState(0);
	const homeStats = useHomeStats();

	useEffect(() => {
		const id = setInterval(() => {
			setActive((i) => (i + 1) % HERO_SLIDES.length);
		}, SLIDE_INTERVAL_MS);
		return () => clearInterval(id);
	}, []);

	return (
		<section className="relative min-h-screen flex items-center overflow-hidden">
			<div className="absolute inset-0">
				<AnimatePresence mode="wait">
					<motion.div
						key={HERO_SLIDES[active].id}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.8 }}
						className="absolute inset-0"
					>
						<Image
							src={HERO_SLIDES[active].image}
							alt={HERO_SLIDES[active].label}
							fill
							priority
							sizes="100vw"
							className="object-cover"
						/>
					</motion.div>
				</AnimatePresence>
				<div
					className="absolute inset-0"
					style={{
						background:
							"linear-gradient(120deg, rgba(92,64,51,0.88) 0%, rgba(92,64,51,0.6) 50%, rgba(92,64,51,0.2) 100%)",
					}}
				/>
				<div className="absolute bottom-6 right-6 z-20 flex gap-2">
					{HERO_SLIDES.map((slide, i) => (
						<button
							key={slide.id}
							type="button"
							onClick={() => setActive(i)}
							aria-label={`Show ${slide.label}`}
							className="relative w-12 h-12 rounded-lg overflow-hidden transition-all duration-200"
							style={{
								outline:
									i === active
										? "2px solid #FFC72C"
										: "2px solid transparent",
								outlineOffset: "2px",
								opacity: i === active ? 1 : 0.7,
							}}
						>
							<Image
								src={slide.image}
								alt={slide.label}
								fill
								sizes="48px"
								className="object-cover"
							/>
						</button>
					))}
				</div>
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
				<div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl text-left">
					<div
						className="inline-flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full mb-6"
						style={{
							backgroundColor: "rgba(255,199,44,0.2)",
							border: "1px solid rgba(255,199,44,0.4)",
						}}
					>
						<Flame
							size={14}
							style={{ color: "#FFC72C" }}
							className="lg:w-4 lg:h-4"
						/>
						<span
							className="text-sm lg:text-base"
							style={{ color: "#FFC72C", fontWeight: 600 }}
						>
							New Recipe Every Week
						</span>
					</div>

					<h1
						className="mb-3 leading-tight"
						style={{
							fontFamily: "'Dancing Script', cursive",
							fontSize: "clamp(44px, 7vw, 104px)",
							fontWeight: 800,
							color: "#FFF8E7",
							lineHeight: 1.1,
						}}
					>
						A Nigerian Kitchen,{" "}
						<span style={{ color: "#FFC72C" }}>Global Table</span>
					</h1>

					<p
						className="mb-1"
						style={{
							fontFamily: "'Dancing Script', cursive",
							fontSize: "clamp(20px, 3.2vw, 38px)",
							fontWeight: 600,
							color: "rgba(255,248,231,0.92)",
						}}
					>
						Cooking the World from Home.
					</p>

					<p
						className="mb-3 text-sm lg:text-base"
						style={{
							color: "#FFC72C",
							fontWeight: 600,
							letterSpacing: "0.04em",
						}}
					>
						by Chizzy
					</p>

					<p
						className="mb-6"
						style={{
							color: "rgba(255,248,231,0.75)",
							fontSize: "clamp(13px, 1.2vw, 17px)",
							lineHeight: 1.6,
						}}
					>
						Nigerian recipes, international dishes, desserts, drinks, and food inspiration — all tested, perfected, and made with love.
					</p>

					<div className="flex flex-wrap gap-4">
						<Link
							href="/search"
							className="inline-flex items-center gap-2 px-7 py-3.5 lg:px-9 lg:py-4 rounded-full text-base lg:text-lg transition-all duration-200"
							style={{
								background: "linear-gradient(135deg, #FFC72C, #FF8C42)",
								color: "#5C4033",
								fontWeight: 700,
								boxShadow: "0 4px 20px rgba(255,199,44,0.4)",
							}}
						>
							Browse Recipes <ArrowRight size={18} />
						</Link>
						<a
							href="#latest"
							className="inline-flex items-center gap-2 px-7 py-3.5 lg:px-9 lg:py-4 rounded-full text-base lg:text-lg transition-all duration-200"
							style={{
								backgroundColor: "rgba(255,255,255,0.15)",
								backdropFilter: "blur(8px)",
								color: "#FFF8E7",
								fontWeight: 600,
								border: "1.5px solid rgba(255,255,255,0.3)",
							}}
						>
							Latest Posts
						</a>
					</div>

					<div className="mt-12 grid grid-cols-4 gap-4 max-w-lg lg:max-w-xl">
						{homeStats.map(({ value, label }) => (
							<div key={label} className="text-left">
								<div
									className="text-xl lg:text-2xl xl:text-3xl font-bold"
									style={{
										color: "#FFC72C",
										fontFamily: "'Dancing Script', cursive",
									}}
								>
									{value}
								</div>
								<div
									className="text-xs lg:text-sm mt-0.5"
									style={{ color: "rgba(255,248,231,0.7)" }}
								>
									{label}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
				<span
					className="text-xs"
					style={{ color: "rgba(255,248,231,0.5)" }}
				>
					Scroll to explore
				</span>
				<div
					className="w-5 h-8 rounded-full border-2 flex justify-center pt-2"
					style={{ borderColor: "rgba(255,248,231,0.3)" }}
				>
					<div
						className="w-1 h-2 rounded-full animate-bounce"
						style={{ backgroundColor: "#FFC72C" }}
					/>
				</div>
			</div>
		</section>
	);
}
