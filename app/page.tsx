"use client"
import { useState, useEffect, useRef } from "react"

export default function Home() {
  const [isRunning, setIsRunning] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState("initial")
  const [intervalDuration, setIntervalDuration] = useState(2000)
  const [activeDuration, setActiveDuration] = useState(200)
  const [inputIntervalDuration, setInputIntervalDuration] = useState(2000)
  const [inputActiveDuration, setInputActiveDuration] = useState(200)
  const [frequency, setFrequency] = useState(440) // Set frequency here
  const [inputFrequency, setInputFrequency] = useState(440)
  const [audioCtx, setAudioCtx] = useState(null)

  const startApp = () => {
    // Create the AudioContext after a user interaction
    if (!audioCtx) {
      // @ts-ignore
      const AudioContext = window.AudioContext || window.webkitAudioContext
      const newAudioCtx = new AudioContext()
      // @ts-ignore
      setAudioCtx(newAudioCtx)
    }

    // Toggle isRunning between true and false
    setIsRunning((prevIsRunning) => !prevIsRunning)
  }

  // useEffect(() => {
  //   // @ts-ignore
  //   const AudioContext = window.AudioContext || window.webkitAudioContext
  //   // @ts-ignore
  //   setAudioCtx(new AudioContext())
  // }, [])

  // Initialize AudioContext
  // @ts-ignore
  // const AudioContext = window.AudioContext || window.webkitAudioContext
  // const audioCtx = new AudioContext()

  const oscillatorRef = useRef(null)

  const updateTimeAndFrequency = () => {
    setIntervalDuration(inputIntervalDuration)
    setActiveDuration(inputActiveDuration)
    setFrequency(inputFrequency)
    setIsRunning(false)

    // Stop the old oscillator and start a new one with the new frequency
    if (isRunning && oscillatorRef.current) {
      // @ts-ignore
      oscillatorRef.current.stop()
      // @ts-ignore
      const oscillator = audioCtx.createOscillator()
      oscillator.type = "sine"
      oscillator.frequency.value = inputFrequency // set new frequency
      // @ts-ignore
      oscillator.connect(audioCtx.destination)
      oscillator.start()
      // @ts-ignore
      oscillatorRef.current = oscillator // assign to ref so it can be stopped later
    }
  }

  useEffect(() => {
    let interval: any = null

    if (isRunning && audioCtx) {
      interval = setInterval(() => {
        setBackgroundColor("white")
        // create and connect a new oscillator each time
        // @ts-ignore
        const oscillator = audioCtx.createOscillator()
        oscillator.type = "sine"
        oscillator.frequency.value = frequency // frequency of the sound
        // @ts-ignore
        oscillator.connect(audioCtx.destination)
        oscillator.start()
        // @ts-ignore
        oscillatorRef.current = oscillator // assign to ref so it can be stopped later

        setTimeout(() => {
          setBackgroundColor("initial")
          oscillator.stop()
        }, activeDuration)
      }, intervalDuration)
    } else {
      if (interval !== null) {
        clearInterval(interval)
        setBackgroundColor("initial")
        // Stop the oscillator when it's not running
        if (oscillatorRef.current) {
          // @ts-ignore
          oscillatorRef.current.stop()
          oscillatorRef.current = null // clear the ref
        }
        interval = null
      }
    }

    // Clear interval on unmount
    return () => {
      if (interval !== null) {
        clearInterval(interval)
      }
      // Stop the oscillator on unmount
      if (oscillatorRef.current) {
        // @ts-ignore
        oscillatorRef.current.stop()
        oscillatorRef.current = null // clear the ref
      }
    }
  }, [isRunning, audioCtx, intervalDuration, activeDuration, frequency])

  useEffect(() => {
    return () => {
      if (audioCtx) {
        // @ts-ignore
        audioCtx.close()
      }
    }
  }, [])
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-24 gap-4"
      style={{ backgroundColor: backgroundColor }}
    >
      <button
        className={`btn ${!isRunning ? "btn-warning" : "btn-error"}`}
        onClick={startApp}
      >
        {isRunning ? "Stop" : "Start"}
      </button>
      <div className="grid gap-4">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Time between blinks</span>
          </div>
          <input
            className="input"
            type="number"
            value={inputIntervalDuration}
            onChange={(e: any) => setInputIntervalDuration(e.target.value)}
          />
          <div className="label">
            <span className="label-text-alt"></span>
            <span className="label-text-alt">In milliseconds</span>
          </div>
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Length of blink and sound</span>
          </div>
          <input
            className="input"
            type="number"
            value={inputActiveDuration}
            onChange={(e: any) => setInputActiveDuration(e.target.value)}
          />
          <div className="label">
            <span className="label-text-alt"></span>
            <span className="label-text-alt">In milliseconds</span>
          </div>
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Sound Frequency</span>
          </div>
          <input
            className="input"
            type="number"
            value={inputFrequency}
            onChange={(e: any) => setInputFrequency(e.target.value)}
          />
          <div className="label">
            <span className="label-text-alt"></span>
            <span className="label-text-alt">in hertz (Hz)</span>
          </div>
        </label>
        <button
          className="btn"
          onClick={updateTimeAndFrequency}
          disabled={
            inputIntervalDuration === intervalDuration &&
            inputActiveDuration === activeDuration &&
            inputFrequency === frequency
          }
        >
          Update
        </button>
      </div>
    </main>
  )
}
