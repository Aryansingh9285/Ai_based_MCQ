import React from 'react';

const HamsterWheel = () => {
  return (
    <>
      <div
        role="img"
        aria-label="Orange and tan hamster running in a metal wheel"
        className="wheel-and-hamster relative w-[12em] h-[12em] text-[14px] bg-[#1c1c1c] rounded-full overflow-hidden"
      >
        <div className="wheel absolute top-0 left-0 w-full h-full rounded-full z-[2]" />

        {/* ✅ Fixed positioning using original CSS values */}
        <div
          className="hamster absolute w-[7em] h-[3.75em] z-[1]"
          style={{ 
            top: '50%', 
            left: 'calc(50% - 3.5em)', 
            transform: 'rotate(4deg) translate(-0.8em, 1.85em)',
            transformOrigin: '50% 0'
          }}
        >
          <div className="hamster__body absolute top-[0.25em] left-[2em] w-[4.5em] h-[3em]">
            <div className="hamster__head absolute top-0 left-[-2em] w-[2.75em] h-[2.5em] z-[1]">
              <div className="hamster__ear absolute top-[-0.25em] right-[-0.25em] w-[0.75em] h-[0.75em]" />
              <div className="hamster__eye absolute top-[0.375em] left-[1.25em] w-[0.5em] h-[0.5em]" />
              <div className="hamster__nose absolute top-[0.75em] left-0 w-[0.2em] h-[0.25em]" />
            </div>
            <div className="hamster__limb hamster__limb--fr absolute top-[2em] left-[0.5em] w-[1em] h-[1.5em]" />
            <div className="hamster__limb hamster__limb--fl absolute top-[2em] left-[0.5em] w-[1em] h-[1.5em]" />
            <div className="hamster__limb hamster__limb--br absolute top-[1em] left-[2.8em] w-[1.5em] h-[2.5em]" />
            <div className="hamster__limb hamster__limb--bl absolute top-[1em] left-[2.8em] w-[1.5em] h-[2.5em]" />
            <div className="hamster__tail absolute top-[1.5em] right-[-0.5em] w-[1em] h-[0.5em]" />
          </div>
        </div>

        <div className="spoke absolute top-0 left-0 w-full h-full rounded-full" />
      </div>

      <style>{`
        .wheel-and-hamster {
          --dur: 1s;
        }

        .wheel {
          background: radial-gradient(100% 100% at center, hsla(0, 0%, 60%, 0) 47.8%, hsl(0, 0%, 60%) 48%);
        }

        .spoke {
          animation: spoke var(--dur) linear infinite;
          background:
            radial-gradient(100% 100% at center, hsl(0, 0%, 60%) 4.8%, hsla(0, 0%, 60%, 0) 5%),
            linear-gradient(hsla(0, 0%, 55%, 0) 46.9%, hsl(0, 0%, 65%) 47% 52.9%, hsla(0, 0%, 65%, 0) 53%) 50% 50% / 99% 99% no-repeat;
        }

        .hamster {
          animation: hamster var(--dur) ease-in-out infinite;
        }

        .hamster__body {
          animation: hamsterBody var(--dur) ease-in-out infinite;
          background: hsl(30, 90%, 90%);
          border-radius: 50% 30% 50% 30% / 15% 60% 40% 40%;
          box-shadow:
            0.1em 0.75em 0 hsl(30, 90%, 55%) inset,
            0.15em -0.5em 0 hsl(30, 90%, 80%) inset;
          transform-origin: 17% 50%;
          transform-style: preserve-3d;
        }

        .hamster__head {
          animation: hamsterHead var(--dur) ease-in-out infinite;
          background: hsl(30, 90%, 55%);
          border-radius: 70% 30% 0 100% / 40% 25% 25% 60%;
          box-shadow:
            0 -0.25em 0 hsl(30, 90%, 80%) inset,
            0.75em -1.55em 0 hsl(30, 90%, 90%) inset;
          transform-origin: 100% 50%;
        }

        .hamster__ear {
          animation: hamsterEar var(--dur) ease-in-out infinite;
          background: hsl(0, 90%, 85%);
          border-radius: 50%;
          box-shadow: -0.25em 0 hsl(30, 90%, 55%) inset;
          transform-origin: 50% 75%;
        }

        .hamster__eye {
          animation: hamsterEye var(--dur) linear infinite;
          background-color: hsl(0, 0%, 0%);
          border-radius: 50%;
        }

        .hamster__nose {
          background: hsl(0, 90%, 75%);
          border-radius: 35% 65% 85% 15% / 70% 50% 50% 30%;
        }

        .hamster__limb--fr,
        .hamster__limb--fl {
          clip-path: polygon(0 0, 100% 0, 70% 80%, 60% 100%, 0% 100%, 40% 80%);
          transform-origin: 50% 0;
        }

        .hamster__limb--fr {
          animation: hamsterFRLimb var(--dur) linear infinite;
          background: linear-gradient(hsl(30, 90%, 80%) 80%, hsl(0, 90%, 75%) 80%);
          transform: rotate(15deg) translateZ(-1px);
        }

        .hamster__limb--fl {
          animation: hamsterFLLimb var(--dur) linear infinite;
          background: linear-gradient(hsl(30, 90%, 90%) 80%, hsl(0, 90%, 85%) 80%);
          transform: rotate(15deg);
        }

        .hamster__limb--br,
        .hamster__limb--bl {
          border-radius: 0.75em 0.75em 0 0;
          clip-path: polygon(0 0, 100% 0, 100% 30%, 70% 90%, 70% 100%, 30% 100%, 40% 90%, 0% 30%);
          transform-origin: 50% 30%;
        }

        .hamster__limb--br {
          animation: hamsterBRLimb var(--dur) linear infinite;
          background: linear-gradient(hsl(30, 90%, 80%) 90%, hsl(0, 90%, 75%) 90%);
          transform: rotate(-25deg) translateZ(-1px);
        }

        .hamster__limb--bl {
          animation: hamsterBLLimb var(--dur) linear infinite;
          background: linear-gradient(hsl(30, 90%, 90%) 90%, hsl(0, 90%, 85%) 90%);
          transform: rotate(-25deg);
        }

        .hamster__tail {
          animation: hamsterTail var(--dur) linear infinite;
          background: hsl(0, 90%, 85%);
          border-radius: 0.25em 50% 50% 0.25em;
          box-shadow: 0 -0.2em 0 hsl(0, 90%, 75%) inset;
          transform: rotate(30deg) translateZ(-1px);
          transform-origin: 0.25em 0.25em;
        }

        @keyframes hamster {
          from, to {
            transform: rotate(4deg) translate(-0.8em, 1.85em);
          }
          50% {
            transform: rotate(0) translate(-0.8em, 1.85em);
          }
        }

        @keyframes hamsterHead {
          from, 25%, 50%, 75%, to { transform: rotate(0); }
          12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(8deg); }
        }

        @keyframes hamsterEye {
          from, 90%, to { transform: scaleY(1); }
          95% { transform: scaleY(0); }
        }

        @keyframes hamsterEar {
          from, 25%, 50%, 75%, to { transform: rotate(0); }
          12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(12deg); }
        }

        @keyframes hamsterBody {
          from, 25%, 50%, 75%, to { transform: rotate(0); }
          12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(-2deg); }
        }

        @keyframes hamsterFRLimb {
          from, 25%, 50%, 75%, to { transform: rotate(50deg) translateZ(-1px); }
          12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(-30deg) translateZ(-1px); }
        }

        @keyframes hamsterFLLimb {
          from, 25%, 50%, 75%, to { transform: rotate(-30deg); }
          12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(50deg); }
        }

        @keyframes hamsterBRLimb {
          from, 25%, 50%, 75%, to { transform: rotate(-60deg) translateZ(-1px); }
          12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(20deg) translateZ(-1px); }
        }

        @keyframes hamsterBLLimb {
          from, 25%, 50%, 75%, to { transform: rotate(20deg); }
          12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(-60deg); }
        }

        @keyframes hamsterTail {
          from, 25%, 50%, 75%, to { transform: rotate(30deg) translateZ(-1px); }
          12.5%, 37.5%, 62.5%, 87.5% { transform: rotate(10deg) translateZ(-1px); }
        }

        @keyframes spoke {
          from { transform: rotate(0); }
          to { transform: rotate(-1turn); }
        }
      `}</style>
    </>
  );
};

export default HamsterWheel;