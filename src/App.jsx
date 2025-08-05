import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Routes, Route } from 'react-router-dom';
import DesktopLending from "./pages/DesktopLending.jsx";
import MobileLending from "./pages/MobileLanding.jsx";
import './style.css'

export default function App() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  if (isMobile) {
    return <MobileLending />;
  }

  if (isDesktop) {
    return <DesktopLending />;
  }
}
