"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/site.config";
import { CATEGORIES, REVIEWS, FEATURES, won, minPrice, type Item } from "@/data";

/* 부름 꽃배달 — "부르면 달려오는" 밝고 친근한 앱 스타일.
   카테고리 칩 탭 → 바로 아래 상품 그리드. 상품을 누르면 '금액 상이' 안내 시트 → 전화 연결. */

const SECTIONS = [
  { id: "products", label: "꽃 고르기" },
  { id: "about", label: "부름 약속" },
  { id: "reviews", label: "받은 메시지" },
  { id: "contact", label: "전화 부르기" },
];

/* 카테고리 칩 아이콘 (CATEGORIES 순서) */
const CHIP_MARKS = ["🎉", "🕊️", "💐", "🧺", "🪴", "🌸"];

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.3 21 3 12.7 3 3c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1.1l-2.2 2.1z" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.1 0 3.6 1.2 4.4 2.5.8-1.3 2.3-2.5 4.4-2.5 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const box = size === "lg" ? "w-24 h-24 rounded-[28px]" : "w-[52px] h-[52px] rounded-2xl";
  if (SITE.logo) {
    return (
      <span className={`${box} block overflow-hidden bg-[var(--blush)] ring-2 ring-white shadow-[0_4px_14px_-4px_rgba(255,79,129,0.45)] shrink-0`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SITE.logo} alt={SITE.name} className="w-full h-full object-cover" />
      </span>
    );
  }
  return <span className="font-jua text-2xl text-[var(--pink)]">{SITE.name}</span>;
}

const FEATURE_ICONS = [
  <svg key="run" viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>,
  <svg key="map" viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>,
  <svg key="hand" viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8c0-3 4-3 4 0s-4 4-4 4-4-1-4-4 4-3 4 0z" />
    <path d="M12 12v9M12 17c-2-2-4-2-5-1.5M12 18c2-2 4-2 5-1.5" />
  </svg>,
];

const FEATURE_TINTS = ["bg-[#ffe4ea] text-[#e23a6c]", "bg-[#ffe9e2] text-[#e8614a]", "bg-[#fff0d9] text-[#d9822b]"];

export default function Home() {
  const [catKey, setCatKey] = useState(CATEGORIES[0].key);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState<Item | null>(null);
  const productsRef = useRef<HTMLElement>(null);
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const tel = `tel:${SITE.phoneHref}`;

  const cat = CATEGORIES.find((c) => c.key === catKey) ?? CATEGORIES[0];

  // 팝업(시트) 열려 있는 동안 스크롤 잠금 + ESC 닫기
  useEffect(() => {
    if (!notice) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNotice(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [notice]);

  // 모바일 메뉴 ESC 닫기
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pick = (key: string) => {
    setCatKey(key);
    chipRefs.current[key]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    const top = productsRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* ───── 헤더 ───── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--line)]">
        <nav className="max-w-6xl mx-auto px-3 sm:px-6 h-[72px] flex items-center justify-between gap-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={`${SITE.name} 맨 위로`}
            className="flex items-center gap-2.5 min-w-0"
          >
            <Logo />
            <span className="hidden min-[400px]:flex flex-col items-start leading-tight">
              <span className="font-jua text-[19px] text-[var(--foreground)]">{SITE.name}</span>
              <span className="text-[11px] text-[var(--muted)]">부르면 달려가요</span>
            </span>
          </button>

          <ul className="hidden md:flex items-center gap-1">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => go(s.id)}
                  className="font-jua px-4 h-11 rounded-full text-[16px] text-[var(--foreground)] hover:bg-[var(--blush)] hover:text-[var(--pink)] transition"
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <a
              href={tel}
              className="pink-grad font-jua flex items-center gap-1.5 h-11 pl-3.5 pr-4 rounded-full text-white text-[15px] shadow-[0_6px_16px_-6px_rgba(255,79,129,0.8)]"
            >
              <PhoneIcon className="w-4 h-4" />
              <span className="tabular-nums">{SITE.phone}</span>
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="메뉴 열기"
              aria-expanded={menuOpen}
              className="md:hidden w-11 h-11 rounded-full bg-[var(--blush)] text-[var(--pink)] flex items-center justify-center"
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="md:hidden anim-pop absolute left-3 right-3 top-[78px] rounded-3xl bg-white shadow-xl border border-[var(--line)] p-2">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className="font-jua w-full text-left px-5 h-12 rounded-2xl text-[17px] hover:bg-[var(--blush)] active:bg-[var(--blush)]"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 pb-28 md:pb-0">
        {/* ───── 인사 카드 (짧게) ───── */}
        <section className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-8">
          <div className="pink-grad relative overflow-hidden rounded-[28px] sm:rounded-[36px] px-5 py-5 sm:px-10 sm:py-10 text-white">
            <div className="absolute -right-10 -top-10 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-white/15" />
            <div className="absolute right-16 -bottom-14 w-28 h-28 sm:w-44 sm:h-44 rounded-full bg-white/10" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1 rounded-full bg-white/25 px-3 py-1 text-[12px] sm:text-[13px]">
                  <HeartIcon className="w-3.5 h-3.5" /> 전국 당일배송 · 365일 상담
                </p>
                <h1 className="font-jua mt-2 text-[26px] leading-[1.25] sm:text-[44px] break-keep">
                  부르면 달려가요,
                  <br className="sm:hidden" /> 꽃 한 송이도!
                </h1>
                <p className="hidden sm:block mt-3 text-[16px] text-white/90 break-keep">
                  아래에서 꽃을 고르고 눌러 주세요. 상담사가 바로 받아 드려요.
                </p>
              </div>
              <span className="hidden sm:flex anim-wiggle shrink-0 w-28 h-28 rounded-full bg-white text-[var(--pink)] items-center justify-center shadow-xl">
                <PhoneIcon className="w-12 h-12" />
              </span>
            </div>
          </div>
        </section>

        {/* ───── 상품: 칩 탭 + 그리드 ───── */}
        <section id="products" ref={productsRef} className="pt-4 sm:pt-8">
          <div className="sticky top-[72px] z-40 bg-[var(--background)]/95 backdrop-blur-md">
            <div className="max-w-6xl mx-auto">
              <div
                role="tablist"
                aria-label="꽃 종류"
                className="no-scrollbar flex gap-2 overflow-x-auto px-3 sm:px-6 py-3"
              >
                {CATEGORIES.map((c, i) => {
                  const on = c.key === catKey;
                  return (
                    <button
                      key={c.key}
                      ref={(el) => {
                        chipRefs.current[c.key] = el;
                      }}
                      role="tab"
                      aria-selected={on}
                      aria-controls="product-grid"
                      onClick={() => pick(c.key)}
                      className={`font-jua shrink-0 flex items-center gap-1.5 h-11 pl-3 pr-4 rounded-full text-[15px] border-2 transition ${
                        on
                          ? "bg-[var(--pink)] border-[var(--pink)] text-white shadow-[0_6px_14px_-6px_rgba(255,79,129,0.9)]"
                          : "bg-white border-[var(--line)] text-[var(--foreground)] hover:border-[var(--blush-2)]"
                      }`}
                    >
                      <span aria-hidden="true">{CHIP_MARKS[i]}</span>
                      {c.name}
                      <span
                        className={`ml-0.5 rounded-full px-1.5 text-[12px] leading-5 ${
                          on ? "bg-white/25" : "bg-[var(--blush)] text-[var(--pink)]"
                        }`}
                      >
                        {c.items.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-3 sm:px-6">
            <div className="flex items-end justify-between gap-3 pt-1 pb-3">
              <div className="min-w-0">
                <h2 className="font-jua text-[22px] sm:text-[28px] text-[var(--foreground)]">{cat.name}</h2>
                <p className="text-[13px] sm:text-[14px] text-[var(--muted)] break-keep">{cat.desc}</p>
              </div>
              <p className="shrink-0 rounded-full bg-white border border-[var(--line)] px-3 py-1 text-[12px] sm:text-[13px] text-[var(--muted)]">
                <span className="font-jua text-[var(--pink)] tabular-nums">{won(minPrice(cat))}~</span>부터
              </p>
            </div>

            <div
              id="product-grid"
              role="tabpanel"
              key={cat.key}
              className="anim-pop grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
            >
              {cat.items.map((it) => (
                <button
                  key={`${it.folder}-${it.name}`}
                  onClick={() => setNotice(it)}
                  className="group text-left rounded-[26px] bg-white p-2 sm:p-2.5 shadow-[0_8px_24px_-14px_rgba(226,58,108,0.45)] border border-[var(--line)] hover:-translate-y-1 hover:shadow-[0_14px_30px_-14px_rgba(226,58,108,0.6)] transition"
                >
                  <span className="block relative aspect-square overflow-hidden rounded-[20px] bg-[var(--blush)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/${it.folder}/${it.name}.jpg`}
                      alt={it.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {it.folder !== cat.name && cat.key === "동서양란" && (
                      <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] text-[var(--pink)]">
                        {it.folder}
                      </span>
                    )}
                  </span>
                  <span className="block px-1.5 pt-2.5 pb-1">
                    <span className="block font-jua text-[15px] sm:text-[17px] leading-snug text-[var(--foreground)] break-keep [overflow-wrap:anywhere]">
                      {it.name}
                    </span>
                    <span className="mt-1 flex items-center justify-between gap-1">
                      <span className="font-jua text-[15px] sm:text-[17px] text-[var(--pink)] tabular-nums">
                        {won(it.price)}~
                      </span>
                      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--blush)] text-[var(--pink)] group-hover:bg-[var(--pink)] group-hover:text-white transition">
                        <PhoneIcon className="w-4 h-4" />
                      </span>
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-4 text-center text-[13px] text-[var(--muted)] break-keep">
              꽃을 누르면 상담사에게 바로 전화로 연결돼요 · 사진과 실제 상품은 지역·시기에 따라 다를 수 있어요
            </p>
          </div>
        </section>

        {/* ───── 부름 약속 ───── */}
        <section id="about" className="max-w-6xl mx-auto px-3 sm:px-6 pt-14 sm:pt-20">
          <div className="text-center">
            <p className="font-jua text-[var(--pink)] text-[15px]">왜 부름이냐면요</p>
            <h2 className="font-jua mt-1 text-[26px] sm:text-[34px] break-keep">부르면, 이렇게 달려가요</h2>
          </div>
          <ol className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-5">
            {FEATURES.map((f, i) => (
              <li
                key={f.t}
                className="flex sm:flex-col items-center sm:items-start gap-4 rounded-[28px] bg-white border border-[var(--line)] p-5 sm:p-7"
              >
                <span className={`shrink-0 w-16 h-16 rounded-[22px] flex items-center justify-center ${FEATURE_TINTS[i]}`}>
                  {FEATURE_ICONS[i]}
                </span>
                <span className="min-w-0">
                  <span className="font-jua block text-[20px] sm:text-[22px]">{f.t}</span>
                  <span className="block mt-0.5 text-[14px] sm:text-[15px] text-[var(--muted)] break-keep">{f.d}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-4 rounded-[28px] bg-[var(--blush)] dots p-5 sm:p-7 flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
            <span className="font-jua text-[18px] sm:text-[20px] text-[var(--pink-deep)] break-keep">
              주문은 이렇게 쉬워요
            </span>
            <ol className="flex flex-wrap justify-center sm:justify-start gap-2 text-[14px]">
              {["① 꽃 고르기", "② 전화로 부르기", "③ 받는 곳·리본 문구 말하기", "④ 당일 배송"].map((s) => (
                <li key={s} className="rounded-full bg-white px-3.5 py-1.5 break-keep">
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───── 후기: 채팅 스타일 ───── */}
        <section id="reviews" className="max-w-6xl mx-auto px-3 sm:px-6 pt-14 sm:pt-20">
          <div className="text-center">
            <p className="font-jua text-[var(--pink)] text-[15px]">부름이 받은 메시지</p>
            <h2 className="font-jua mt-1 text-[26px] sm:text-[34px] break-keep">고객님들이 보내 주신 이야기</h2>
          </div>

          <div className="mt-6 mx-auto max-w-3xl rounded-[32px] bg-white border border-[var(--line)] overflow-hidden">
            <div className="flex items-center gap-3 px-4 sm:px-6 h-16 border-b border-[var(--line)] bg-[var(--background)]">
              <Logo />
              <div className="min-w-0">
                <p className="font-jua text-[16px] leading-tight">{SITE.name} 후기방</p>
                <p className="text-[12px] text-[var(--muted)]">고객 {REVIEWS.length}명 참여</p>
              </div>
            </div>
            <ul className="dots px-3 sm:px-6 py-5 space-y-4">
              {REVIEWS.map((r, i) => {
                const right = i % 2 === 1;
                return (
                  <li key={r.name + r.title} className={`flex items-end gap-2 ${right ? "flex-row-reverse" : ""}`}>
                    <span
                      aria-hidden="true"
                      className={`font-jua shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-[15px] ${
                        right ? "bg-[var(--pink)] text-white" : "bg-[var(--blush)] text-[var(--pink)]"
                      }`}
                    >
                      {r.name.charAt(0)}
                    </span>
                    <div className={`min-w-0 max-w-[82%] sm:max-w-[70%] ${right ? "text-right" : ""}`}>
                      <p className="text-[12px] text-[var(--muted)] px-1 mb-1">{r.name} 고객님</p>
                      <div
                        className={`inline-block text-left px-4 py-3 shadow-sm ${
                          right
                            ? "pink-grad text-white rounded-[22px] rounded-br-md"
                            : "bg-white border border-[var(--line)] rounded-[22px] rounded-bl-md"
                        }`}
                      >
                        <p className="font-jua text-[16px] leading-snug break-keep">{r.title}</p>
                        <p className={`mt-1 text-[14px] leading-relaxed break-keep ${right ? "text-white/90" : "text-[var(--muted)]"}`}>
                          {r.body}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ───── 전화 부르기 ───── */}
        <section id="contact" className="max-w-6xl mx-auto px-3 sm:px-6 pt-14 sm:pt-20 pb-14">
          <div className="relative overflow-hidden rounded-[36px] bg-white border-2 border-[var(--blush-2)] px-5 py-10 sm:py-14 text-center">
            <div className="absolute -left-12 -top-12 w-40 h-40 rounded-full bg-[var(--blush)]" />
            <div className="absolute -right-10 -bottom-16 w-48 h-48 rounded-full bg-[#ffe9e2]" />
            <div className="relative">
              <span className="anim-wiggle inline-flex w-16 h-16 rounded-full pink-grad text-white items-center justify-center shadow-lg">
                <PhoneIcon className="w-8 h-8" />
              </span>
              <h2 className="font-jua mt-4 text-[26px] sm:text-[36px] break-keep">지금 바로 부름을 불러 주세요</h2>
              <p className="mt-2 text-[15px] text-[var(--muted)] break-keep">
                어떤 꽃이 좋을지 몰라도 괜찮아요. 상황만 말씀해 주시면 골라 드려요.
              </p>
              <a
                href={tel}
                className="chubby pink-grad font-jua mt-6 inline-flex items-center justify-center gap-2 h-16 px-8 rounded-full text-white text-[24px] sm:text-[28px] tabular-nums transition"
              >
                <PhoneIcon className="w-6 h-6" />
                {SITE.phone}
              </a>
              <p className="mt-4 text-[13px] text-[var(--muted)]">365일 상담 · 전국 당일배송 (도서·산간 일부 제외)</p>
            </div>
          </div>
        </section>
      </main>

      {/* ───── 푸터 ───── */}
      <footer className="bg-[var(--blush)] pb-28 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <Logo size="lg" />
          <div className="min-w-0">
            <p className="font-jua text-[20px]">{SITE.name}</p>
            <p className="mt-1 text-[14px] text-[var(--muted)] break-keep">
              축하화환 · 근조화환 · 꽃다발 · 꽃바구니 · 관엽화분 · 동·서양란 전국 당일배송
            </p>
            <a href={tel} className="font-jua mt-3 inline-flex items-center gap-1.5 h-11 px-4 rounded-full bg-white text-[var(--pink)] tabular-nums">
              <PhoneIcon className="w-4 h-4" /> 주문·상담 {SITE.phone}
            </a>
            <p className="mt-4 text-[12px] text-[var(--muted)]">© {SITE.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ───── 모바일 하단 고정 '전화 부르기' 바 ───── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 px-3 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] bg-gradient-to-t from-white via-white/95 to-white/0">
        <a
          href={tel}
          className="chubby pink-grad font-jua flex items-center justify-center gap-2 h-14 rounded-full text-white text-[19px] transition"
        >
          <PhoneIcon className="w-5 h-5" />
          전화로 부르기
          <span className="text-white/85 text-[16px] tabular-nums">{SITE.phone}</span>
        </a>
      </div>

      {/* ───── 안내 시트(팝업) ───── */}
      {notice && (
        <div
          className="anim-fade fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-[#3a2a30]/45 backdrop-blur-[2px] sm:p-4"
          onClick={() => setNotice(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-title"
            className="anim-sheet w-full sm:max-w-sm bg-white rounded-t-[32px] sm:rounded-[32px] px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] sm:pb-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:hidden mx-auto w-12 h-1.5 rounded-full bg-[var(--line)]" />
            <div className="flex items-center gap-3 mt-4 sm:mt-3">
              <span className="shrink-0 w-16 h-16 rounded-2xl overflow-hidden bg-[var(--blush)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/${notice.folder}/${notice.name}.jpg`} alt="" className="w-full h-full object-cover" />
              </span>
              <div className="min-w-0">
                <h3 id="notice-title" className="font-jua text-[20px] leading-snug break-keep">
                  {notice.name}
                </h3>
                <p className="font-jua text-[var(--pink)] tabular-nums">{won(notice.price)}~</p>
              </div>
            </div>
            <p className="mt-4 rounded-2xl bg-[var(--blush)] px-4 py-3.5 text-[15px] leading-relaxed text-[var(--foreground)] break-keep">
              {SITE.priceNotice}
            </p>
            <p className="mt-3 text-center text-[13px] text-[var(--muted)]">
              대표번호 <span className="font-jua text-[var(--foreground)] tabular-nums">{SITE.phone}</span>
            </p>
            <div className="mt-4 grid grid-cols-[1fr_1.6fr] gap-2.5">
              <button
                onClick={() => setNotice(null)}
                className="font-jua h-14 rounded-full bg-[#f4eef0] text-[var(--muted)] text-[17px]"
              >
                취소
              </button>
              <a
                href={tel}
                onClick={() => setNotice(null)}
                autoFocus
                className="chubby pink-grad font-jua h-14 rounded-full flex items-center justify-center gap-1.5 text-white text-[17px] transition"
              >
                <PhoneIcon className="w-4 h-4" />
                전화 연결
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
