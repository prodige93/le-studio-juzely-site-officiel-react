import logolab from "./img/logolab.jpg";

const Header = () => {
  return (
    <div className="page-container">
      <button className="button-header-studio">
        <img
          src={logolab} // Corrigé ici
          alt="Icon le studio juzely"
          style={{ width: "150px", marginRight: "8px" }}
        />
      </button>
      <button className="button-header-studio-upgrade">upgrade plan</button>
    </div>
  );
};

export default Header;
