import logoImg from '../assets/logo-new.png';
import './Logo.css';

const Logo = ({ size = 'normal', onClick }) => {
    // size can be 'normal' or 'large'
    const isLarge = size === 'large';
    
    return (
        <div className={`medexplain-logo ${isLarge ? 'logo-large' : ''}`} onClick={onClick}>
            <div className="image-logo-container">
                <img src={logoImg} alt="MedExplain Logo" className="custom-logo-img" />
            </div>
            <div className="logo-text-wrapper">
                <span className="logo-med">Med</span>
                <span className="logo-explain">Explain</span>
                <span className="logo-ai-badge">AI</span>
            </div>
        </div>
    );
};

export default Logo;
