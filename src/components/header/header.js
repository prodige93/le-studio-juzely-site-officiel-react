import logolab from "./img/logolab.jpg";
import iconutilisateur from "./img/iconutilisateur.png";
import { useNavigate } from "react-router-dom";

function Header () {
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate("/");
  };
  return (
    <div className="page-container">
      <button className="button-header-studio" onClick={handleLogoClick}>
        <img
          src={logolab} // Corrigé ici
          alt="Icon le studio juzely"
          style={{ width: "145px", marginRight: "8px" }}
        />
      </button>
      <button className="button-header-studio-upgrade">upgrade plan</button>
      <button className="button-header-studio">
        <img 
          src={iconutilisateur}
          alt="icon utilisateur de couleur bleu"
          style={{ width: "60px", marginLeft: "8px" }}
        />
      </button>
    </div>
  );
};

export default Header;
