import css from '@/components/Footer/Footer.module.css';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Artem Kulish</p>
          <p>
            Contact me:
            <a href="mailto:akulish247@gmail.com">
              akulish247@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}