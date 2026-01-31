import { useState, useEffect, useRef, useCallback } from 'react';
import { STORYBOARD } from '../data/storyboard';
import { FlyToInterpolator } from '@deck.gl/core';

export const useCinematicStory = (
  setViewState: (viewState: any) => void,
  setLayerState: (state: any) => void,
  setYear: (year: number) => void
) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  const currentScene = STORYBOARD[currentSceneIndex];

  const playScene = useCallback((index: number) => {
    if (index >= STORYBOARD.length) {
      setIsPlaying(false);
      setCurrentSceneIndex(0);
      return;
    }

    const scene = STORYBOARD[index];
    setCurrentSceneIndex(index);
    
    // 1. Move Camera
    setViewState((prev: any) => ({
      ...prev,
      ...scene.viewState,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
    }));

    // 2. Set Layers
    setLayerState((prev: any) => ({
      nightLights: false,
      urbanBoundaries: false,
      vegetation: false,
      temperature: false,
      predictiveGhost: false,
      ...scene.layers
    }));

    // 3. Set Year
    if (scene.year) {
      setYear(scene.year);
    }

    // 4. Start Timer for next scene
    startTimeRef.current = Date.now();
    
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      playScene(index + 1);
    }, scene.duration);

  }, [setViewState, setLayerState, setYear]);

  const startStory = () => {
    setIsPlaying(true);
    playScene(0);
  };

  const stopStory = () => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  // Progress Bar Logic
  useEffect(() => {
    if (!isPlaying) return;

    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const sceneDuration = currentScene.duration;
      const sceneProgress = Math.min(elapsed / sceneDuration, 1);
      
      // Global progress
      const totalScenes = STORYBOARD.length;
      const globalProgress = (currentSceneIndex + sceneProgress) / totalScenes;
      
      setProgress(globalProgress * 100);

      animationFrameRef.current = requestAnimationFrame(updateProgress);
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, currentSceneIndex, currentScene]);

  return {
    isPlaying,
    currentScene,
    startStory,
    stopStory,
    progress
  };
};
