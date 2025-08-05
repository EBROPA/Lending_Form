import React, { useState } from 'react';
import styles from './pageCSS/DesktopLending.module.css';
import backgroundImg from '../assets/backgroundDesktop.jpg';
import PhoneInput from '../UI/PhoneInput.jsx';
import { downloadPresentation } from '../utils/downloadUtils';

const Modal = ({ isOpen, onClose, message, showDownloadButton, onDownload }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <p className={styles.modalMessage}>{message}</p>
        {showDownloadButton && (
          <button
            className={styles.downloadButton}
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
          >
            Скачать презентацию
          </button>
        )}
        <button className={styles.modalCloseButton} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default function DesktopLending() {
  const [phone, setPhone] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  const isPhoneComplete = (phoneNumber) => {
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    return digitsOnly.length === 11;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPhoneComplete(phone)) {
      setModalMessage('Пожалуйста, введите полный номер телефона');
      setShowDownloadButton(false);
      setIsModalOpen(true);
      return;
    }

    setModalMessage('Отправка...');
    setShowDownloadButton(false);
    setIsModalOpen(true);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      if (!res.ok) throw new Error(await res.text());

      // Успешная отправка
      setPhone('');

      // Попытка автоматического скачивания
      const downloadSuccess = await downloadPresentation();

      if (downloadSuccess) {
        setModalMessage('Спасибо! Наш специалист свяжется с вами.');
      } else {
        setModalMessage('Спасибо! Наш специалист свяжется с вами. Презентация не скачалась автоматически.');
        setShowDownloadButton(true);
      }
    } catch (err) {
      console.error(err);
      setModalMessage('Ошибка отправки. Попробуйте ещё раз.');
      setShowDownloadButton(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowDownloadButton(false);
  };

  return (
    <div className={styles.background}>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        message={modalMessage}
        showDownloadButton={showDownloadButton}
        onDownload={downloadPresentation}
      />

      <div className={styles.container}>
        <img
          src={backgroundImg}
          alt="Hero background"
          className={styles.photo}
        />
        <div className={styles.textBack}>
          <div className={styles.h1TextContainer}>
            <p className={styles.h1Text}>
              Новостройки премиум <br />и бизнес класса в Москве
            </p>
          </div>
          <form className={styles.callBack} onSubmit={handleSubmit}>
            <PhoneInput
              value={phone}
              onAccept={val => setPhone(val)}
              onComplete={val => {}}
              required
            />
            <button type="submit" className={styles.button}>
              Получить презентацию
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}