import React from "react";
/** import a faire pour la source des buttons header de jules */
/** reprendre tout la configuration des buttons */
const Header = () => {
  return (
    <div className="page-container">
      <button>
        <img 
          src={icon}
          alt='Icon'
          style={{ width: '20px', marginRight: '8px' }}
        />
      </button>
      <button className="button-header-studio">le studio juzely</button>
      <button className="button-upgrade-plan-header">upgrade plan</button>
      <button>
        <img 
          src={icon}
          alt="Icon"
          style={{ width: '20px', marginRight: '8px' }}
        />
        upgrade plan
      </button>
    </div>
  );
};

export default Header;
