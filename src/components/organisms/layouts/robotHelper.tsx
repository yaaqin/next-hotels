'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const IDLE_FIRST_MS = 5_000;
const IDLE_AFTER_DISMISS_MS = 15_000;

export default function IdleRobotHelper() {
    const [visible, setVisible] = useState(false);
    const visibleRef = useRef(false);
    const dismissedRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { t } = useTranslation()

    const setVisibleSync = (val: boolean) => {
        visibleRef.current = val;
        setVisible(val);
    };

    const scheduleNext = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        const delay = dismissedRef.current ? IDLE_AFTER_DISMISS_MS : IDLE_FIRST_MS;
        timerRef.current = setTimeout(() => setVisibleSync(true), delay);
    };

    const resetTimer = () => {
        if (visibleRef.current) return;
        scheduleNext();
    };

    const handleDismiss = () => {
        dismissedRef.current = true;
        setVisibleSync(false);
        scheduleNext();
    };

    useEffect(() => {
        const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
        scheduleNext();
        return () => {
            events.forEach((e) => window.removeEventListener(e, resetTimer));
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                right: '1.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 9999,
                width: 200,
                background: 'white',
                borderRadius: 16,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                animation: 'slideIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            }}
        >
            <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-50%) translateX(60px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 #bfdbfe; }
          50%      { box-shadow: 0 0 0 5px transparent; }
        }
        @keyframes blink {
          0%,90%,100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
      `}</style>

            <button
                onClick={handleDismiss}
                style={{
                    position: 'absolute', top: 8, right: 10,
                    background: 'none', border: 'none',
                    fontSize: 16, color: '#94a3b8', cursor: 'pointer', lineHeight: 1,
                }}
                aria-label="Tutup"
            >
                ×
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', marginBottom: 2 }} />
                <div style={{ width: 3, height: 10, background: '#94a3b8', borderRadius: 2 }} />
                <div style={{
                    width: 52, height: 40, background: '#f8fafc',
                    border: '1px solid #e2e8f0', borderRadius: 8,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[0, 1].map((i) => (
                            <div key={i} style={{
                                width: 8, height: 8, borderRadius: '50%', background: '#3b82f6',
                                animation: 'blink 4s infinite',
                                animationDelay: i === 1 ? '0.1s' : '0s',
                            }} />
                        ))}
                    </div>
                    <div style={{ width: 22, height: 5, border: '1px solid #cbd5e1', borderRadius: 3 }} />
                </div>
                <div style={{ width: 12, height: 5, background: '#f1f5f9', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }} />
                <div style={{
                    width: 62, height: 30, background: '#f8fafc',
                    border: '1px solid #e2e8f0', borderRadius: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: '#dbeafe', border: '1.5px solid #3b82f6',
                        animation: 'pulse 2s infinite',
                    }} />
                </div>
            </div>

            <p style={{ fontSize: 12, color: '#475569', textAlign: 'center', lineHeight: 1.4, fontWeight: 500 }}>
                {t("text.home.robot.needHelp")}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                <Link
                    href="/simple-guideline"
                    style={{
                        width: '100%', padding: '7px 10px',
                        background: '#3b82f6', color: 'white',
                        border: 'none', borderRadius: 8, fontSize: 12,
                        fontWeight: 500, textAlign: 'center', textDecoration: 'none',
                        display: 'block',
                    }}
                >
                    {t("text.home.robot.guideBtn")}
                </Link>
                <button
                    onClick={handleDismiss}
                    style={{
                        width: '100%', padding: '6px 10px',
                        background: 'transparent', color: '#94a3b8',
                        border: '1px solid #e2e8f0', borderRadius: 8,
                        fontSize: 11, cursor: 'pointer',
                    }}
                >
                    {t("text.home.robot.dismissBtn")}
                </button>
            </div>
        </div>
    );
}