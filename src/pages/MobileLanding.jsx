import React, { useState } from 'react';
import styles from './pageCSS/MobileLending.module.css';
import buildingImg from '../assets/backgroundMobile.jpg';
import PhoneInput from '../UI/PhoneInput.jsx';
import { downloadPresentation } from '../utils/downloadUtils';

export default function MobileLending() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');

  const isPhoneComplete = (phoneNumber) => {
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    return digitsOnly.length === 11;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPhoneComplete(phone)) {
      setStatus('Пожалуйста, введите полный номер телефона');
      return;
    }

    setStatus('Отправка...');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) throw new Error(await res.text());

      setPhone('');

      const downloadSuccess = await downloadPresentation();

      if (downloadSuccess) {
        setStatus('Спасибо! Наш специалист свяжется с вами. Презентация скачивается автоматически.');
      } else {
        setStatus('Спасибо! Наш специалист свяжется с вами. Если презентация не скачалась автоматически, нажмите на кнопку ниже.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Ошибка отправки. Попробуйте ещё раз.');
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <img src={buildingImg} alt="Новостройки премиум и бизнес класса в Москве" className={styles.buildingImage} />
          <p className={styles.startPrice}>Стартовая цена<br />От 400 000 ₽ за м²</p>
          <h1 className={styles.h1Text}>
            НОВОСТРОЙКИ ПРЕМИУМ <br />
            И БИЗНЕС КЛАССА В МОСКВЕ
          </h1>
        </div>
        {/* Основной контент */}
        <div className={styles.content}>
          <p className={styles.subtitle}>
            Скачайте презентацию новых комплексов в Москве
          </p>
          <form className={styles.callBack} onSubmit={handleSubmit}>
            <PhoneInput
              value={phone}
              onAccept={val => setPhone(val)}
              onComplete={val => {}}
              required
              className={styles.phoneInput}
            />
            <button type="submit" className={styles.button}>
              Получить презентацию
            </button>
          </form>
          <p className={styles.footer}>
            Оставьте свой номер, с вами свяжется наш специалист
          </p>
          {status && <p className={styles.status}>{status}</p>}

          {status && status.includes('не скачалась') && (
            <button
              className={styles.manualDownloadButton}
              onClick={(e) => {
                e.preventDefault();
                downloadPresentation();
              }}
            >
              Скачать презентацию вручную
            </button>
          )}
        </div>
      </div>
    </div>
  );
}