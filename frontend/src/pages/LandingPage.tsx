import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import './LandingPage.css'

const HeroCarScene = lazy(() => import('../components/HeroCarScene'))

type SceneStatus = 'loading' | 'ready' | 'missing' | 'unavailable'

function canRenderWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const context =
      canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    const supported = context !== null
    context?.getExtension('WEBGL_lose_context')?.loseContext()
    return supported
  } catch {
    return false
  }
}

function StaticCarFallback() {
  return (
    <div aria-label="Car preview illustration" className="cq-static-car" role="img">
      <svg fill="none" viewBox="0 0 920 500">
        <defs>
          <linearGradient id="fallback-paint" x1="196" x2="700" y1="210" y2="416">
            <stop stopColor="#414943" />
            <stop offset="1" stopColor="#1B211D" />
          </linearGradient>
          <linearGradient id="fallback-glass" x1="320" x2="610" y1="150" y2="296">
            <stop stopColor="#E8E6DE" stopOpacity=".78" />
            <stop offset="1" stopColor="#858D85" stopOpacity=".45" />
          </linearGradient>
        </defs>
        <ellipse cx="457" cy="401" fill="#050606" opacity=".5" rx="338" ry="33" />
        <path
          d="m105 335 55-12 66-111c22-37 63-60 106-60h196c54 0 103 25 134 68l76 106 64 11c29 5 50 30 50 59v25H67v-31c0-27 13-48 38-55Z"
          fill="url(#fallback-paint)"
          stroke="#A88654"
          strokeOpacity=".78"
          strokeWidth="3"
        />
        <path
          d="m247 225-54 93h230V177h-87c-37 0-71 19-89 48Zm209-48v141h301l-67-98c-20-27-52-43-86-43H456Z"
          fill="url(#fallback-glass)"
          stroke="#D8D8CF"
          strokeOpacity=".58"
          strokeWidth="3"
        />
        <path
          d="M423 177v141m33-141v141M168 324h513m-579 27h62m592 0h60"
          stroke="#D8D8CF"
          strokeOpacity=".38"
          strokeWidth="3"
        />
        <path d="M100 361h48m620 0h51" stroke="#C1A778" strokeLinecap="round" strokeWidth="8" />
        <path d="M75 421h770" stroke="#F2F0E9" strokeDasharray="4 17" strokeOpacity=".2" strokeWidth="2" />
        <circle cx="251" cy="385" r="61" fill="#101310" stroke="#777E76" strokeWidth="3" />
        <circle cx="251" cy="385" r="34" stroke="#D4D3C9" strokeOpacity=".7" strokeWidth="3" />
        <circle cx="251" cy="385" r="8" fill="#A88654" />
        <circle cx="666" cy="385" r="61" fill="#101310" stroke="#777E76" strokeWidth="3" />
        <circle cx="666" cy="385" r="34" stroke="#D4D3C9" strokeOpacity=".7" strokeWidth="3" />
        <circle cx="666" cy="385" r="8" fill="#A88654" />
      </svg>
    </div>
  )
}

function LandingPage() {
  const [webGLAvailable] = useState(canRenderWebGL)
  const [sceneStatus, setSceneStatus] = useState<SceneStatus>(
    webGLAvailable ? 'loading' : 'unavailable',
  )
  const [progress, setProgress] = useState(0)
  const handleProgress = useCallback((value: number) => setProgress(value), [])
  const handleReady = useCallback(() => setSceneStatus('ready'), [])
  const handleMissing = useCallback(() => setSceneStatus('missing'), [])
  const handleUnavailable = useCallback(() => setSceneStatus('unavailable'), [])

  useEffect(() => {
    let cancelled = false
    let cleanup = () => {}
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([gsapModule, scrollTriggerModule]) => {
        if (cancelled) return
        const { gsap } = gsapModule
        const { ScrollTrigger } = scrollTriggerModule
        gsap.registerPlugin(ScrollTrigger)
        const media = gsap.matchMedia()
        media.add('(prefers-reduced-motion: no-preference)', () => {
          gsap.fromTo(
            '.cq-reveal',
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power2.out', delay: 0.2 },
          )
          gsap.fromTo(
            '.cq-story-reveal',
            { autoAlpha: 0, y: 26 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: { trigger: '.cq-story', start: 'top 82%', once: true },
            },
          )
        })
        cleanup = () => media.revert()
      },
    )
    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return (
    <div className="cq-cinema">
      <header className="cq-cinema-header">
        <Link aria-label="CarQeemat home" className="cq-cinema-brand" to="/">
          <span className="cq-brand-symbol">CQ</span>
          <span><strong>CarQeemat</strong></span>
        </Link>
        <nav aria-label="Main navigation" className="cq-cinema-nav">
          <a href="#approach">Our approach</a>
          <Link to="/insights">Insights</Link>
        </nav>
        <Link className="cq-header-cta" to="/estimate">Value my car <ArrowUpRight size={15} /></Link>
      </header>

      <main>
        <section aria-labelledby="cq-hero-title" className="cq-hero">
          <div aria-hidden="true" className="cq-hero-halo" />
          <div aria-label="Interactive 3D car preview" className="cq-car-stage">
            {webGLAvailable ? (
              <Suspense fallback={<div className="cq-scene-loading">Preparing the car…</div>}>
                <HeroCarScene
                  onMissing={handleMissing}
                  onProgress={handleProgress}
                  onReady={handleReady}
                  onUnavailable={handleUnavailable}
                />
              </Suspense>
            ) : (
              <StaticCarFallback />
            )}
          </div>

          <div className="cq-hero-copy">
            <p className="cq-kicker cq-reveal"><span /> PAKISTAN&apos;S INTELLIGENT CAR VALUATION PLATFORM</p>
            <h1 className="cq-reveal" id="cq-hero-title">KNOW YOUR<br />CAR&apos;S <em>WORTH.</em></h1>
            <p className="cq-lede cq-reveal">A considered estimate for your next move, informed by machine learning and real Pakistani car listings.</p>
            <Link className="cq-primary-button cq-reveal" to="/estimate">Estimate your car <ArrowRight size={16} /></Link>
          </div>

          <div aria-live="polite" className="cq-scene-status">
            {sceneStatus === 'loading' && <><span className="cq-status-dot cq-status-loading" />{progress > 0 ? `Loading car · ${progress}%` : 'Preparing the car'}</>}
            {sceneStatus === 'ready' && <><span className="cq-status-dot" />Interactive preview</>}
            {sceneStatus === 'missing' && <span>Car preview unavailable</span>}
            {sceneStatus === 'unavailable' && <span>3D preview unavailable on this device</span>}
          </div>

          {sceneStatus === 'missing' && (
            <div className="cq-scene-fallback">
              <span>THE ESTIMATE IS STILL READY</span>
              <Link to="/estimate">Continue to estimate <ArrowRight size={14} /></Link>
            </div>
          )}

          <a className="cq-scroll-cue" href="#approach"><span>SCROLL TO DISCOVER</span><ArrowDownRight size={15} /></a>
          <span className="cq-hero-index">01 <i /> 02</span>
        </section>

        <section aria-labelledby="cq-approach-title" className="cq-story" id="approach">
          <div className="cq-story-inner cq-story-reveal">
            <p className="cq-kicker"><span /> BUILT AROUND YOUR CAR</p>
            <h2 id="cq-approach-title">A better sense<br />of <em>what it&apos;s worth.</em></h2>
            <p>CarQeemat uses the details you provide and a machine learning model trained on historical OLX Pakistan listings to estimate an asking price.</p>
            <Link className="cq-primary-button" to="/estimate">Find your car&apos;s value <ArrowRight size={16} /></Link>
          </div>
          <div className="cq-story-aside cq-story-reveal">
            <span>YOUR DETAILS</span><i /><span>VALUATION MODEL</span><i /><span>ESTIMATE IN PKR</span>
          </div>
        </section>
      </main>

      <footer className="cq-cinema-footer">
        <Link aria-label="CarQeemat home" className="cq-footer-wordmark" to="/">CarQeemat</Link>
        <a className="cq-model-credit" href="https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept" rel="noreferrer" target="_blank">
          Car Concept model · Darmstadt Graphics Group GmbH &amp; Eric Chadwick · CC BY 4.0
        </a>
        <Link to="/estimate">Estimate your car <ArrowUpRight size={13} /></Link>
      </footer>
    </div>
  )
}

export default LandingPage
