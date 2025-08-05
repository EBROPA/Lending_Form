import React from 'react';
import { IMaskInput } from 'react-imask';
import styles from '../pages/pageCSS/DesktopLending.module.css';

export default function PhoneInput({ value, onAccept, onComplete }) {
  return (
    <IMaskInput
      mask={'+7 (000) 000-00-00'}
      placeholderChar={'\u00A0'}
      placeholder={'+7 (999) 999-99-99'}
      unmask={false}
      value={value}
      onAccept={onAccept}
      onComplete={onComplete}
      className={styles.phoneInput}
    />
  );
}
