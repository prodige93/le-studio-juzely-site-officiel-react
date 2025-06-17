import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import database from '../../utils/database';
import './size.chart.css';

function SizeChart() {
  const [selectedFit, setSelectedFit] = useState('custom');
  const [editableSizeData, setEditableSizeData] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  
  const handleMyOrdersClick = () => {
    navigate('/');
  };
  

  
  // Initialize editable data with default values
  useEffect(() => {
    setEditableSizeData(sizeData);
  }, []);
  
  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if file is SVG or PNG
      const allowedTypes = ['image/svg+xml', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Veuillez sélectionner un fichier SVG ou PNG uniquement.');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La taille du fichier ne doit pas dépasser 5MB.');
        return;
      }
      
      try {
        // Create preview URL
        const reader = new FileReader();
        reader.onload = async (e) => {
          const preview = e.target.result;
          
          // Save image to database
          const imageId = database.saveImage(file, preview);
          
          // Update state with image data including database ID
          setUploadedImage({
            id: imageId,
            file: file,
            name: file.name,
            type: file.type,
            size: file.size
          });
          setImagePreview(preview);
          setIsModified(true);
          
          console.log('Image uploadée et sauvegardée:', imageId, file.name);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        alert('Erreur lors de l\'upload de l\'image. Veuillez réessayer.');
      }
    }
  };
  
  // Remove uploaded image
  const removeImage = () => {
    if (uploadedImage && uploadedImage.id) {
      // Delete from database
      database.deleteImage(uploadedImage.id);
      console.log('Image supprimée de la base de données:', uploadedImage.id);
    }
    setUploadedImage(null);
    setImagePreview(null);
    setIsModified(true);
  };
   
   // Handle cell value changes
   const handleCellChange = (size, measurementKey, value) => {
     const numValue = parseFloat(value) || 0;
     setEditableSizeData(prev => ({
       ...prev,
       [size]: {
         ...prev[size],
         [measurementKey]: numValue
       }
     }));
     setIsModified(true);
   };
   
   // Validate cell values based on size rules
   const validateCell = (size, measurementKey, value) => {
     const numValue = parseFloat(value);
     if (isNaN(numValue) || numValue < 0 || numValue > 200) {
       alert(`Valeur invalide pour ${measurementKey}. Veuillez entrer une valeur entre 0 et 200.`);
       return false;
     }
     return true;
   };
   
   // Save data to database
   const saveToDatabase = async () => {
     try {
       const dataToSave = {
         fit: selectedFit,
         sizeData: editableSizeData,
         uploadedImage: uploadedImage ? {
           id: uploadedImage.id,
           name: uploadedImage.name,
           type: uploadedImage.type,
           size: uploadedImage.size
         } : null,
         type: 'size_chart_quote'
       };
       
       // Save quote using database
       const quoteId = database.saveQuote(dataToSave);
       
       alert(`Guide des tailles sauvegardé avec succès! ID: ${quoteId}`);
       setIsModified(false);
       
       console.log('Devis sauvegardé:', quoteId, dataToSave);
     } catch (error) {
       console.error('Erreur lors de la sauvegarde:', error);
       alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
     }
   };
   
   // Load saved quotes from database
   const loadSavedQuotes = () => {
     try {
       const savedQuotes = database.getAllQuotes();
       const stats = database.getStats();
       
       console.log('Devis sauvegardés:', savedQuotes);
       console.log('Statistiques de la base de données:', stats);
       
       if (savedQuotes.length > 0) {
         // Show detailed information about quotes
         const quotesInfo = savedQuotes.map(quote => {
           const hasImage = quote.uploadedImage ? '🖼️' : '📄';
           const date = new Date(quote.createdAt).toLocaleDateString('fr-FR');
           return `${hasImage} ${quote.fit} - ${date} (ID: ${quote.id.slice(-8)})`;
         }).join('\n');
         
         alert(`${savedQuotes.length} devis trouvés:\n\n${quotesInfo}\n\nConsultez la console pour plus de détails.`);
       } else {
         alert('Aucun devis sauvegardé trouvé.');
       }
       
       return savedQuotes;
     } catch (error) {
       console.error('Erreur lors du chargement:', error);
       alert('Erreur lors du chargement des devis.');
       return [];
     }
   };
   
   // Clean up old data
   const cleanupDatabase = () => {
     try {
       database.cleanupOldData(30); // Clean data older than 30 days
       alert('Nettoyage de la base de données effectué.');
     } catch (error) {
       console.error('Erreur lors du nettoyage:', error);
       alert('Erreur lors du nettoyage.');
     }
   };

  const fitOptions = [
    { id: 'custom', label: 'Custom fit' },
    { id: 'regular', label: 'Regular fit' },
    { id: 'boxy', label: 'Boxy fit' },
    { id: 'relaxed', label: 'Relaxed fit' },
    { id: 'cropped', label: 'Cropped (1/2 Sleeve) Fit' }
  ];

  const sizeData = {
    'XXS': { totalLength: 63, chestWidth: 50, bottomWidth: 50, sleeveLength: 18, armhole: 22.5, sleeveOpening: 18.5, neckRibLength: 2.5, neckOpening: 18.5, shoulderToShoulder: 49 },
    'XS': { totalLength: 65, chestWidth: 52, bottomWidth: 52, sleeveLength: 19, armhole: 23, sleeveOpening: 19, neckRibLength: 2.5, neckOpening: 18.5, shoulderToShoulder: 51 },
    'S': { totalLength: 67, chestWidth: 54, bottomWidth: 54, sleeveLength: 20, armhole: 23.5, sleeveOpening: 19.5, neckRibLength: 2.5, neckOpening: 18.5, shoulderToShoulder: 53 },
    'M': { totalLength: 69, chestWidth: 56, bottomWidth: 56, sleeveLength: 21, armhole: 24, sleeveOpening: 20, neckRibLength: 2.5, neckOpening: 18.5, shoulderToShoulder: 55 },
    'L': { totalLength: 71, chestWidth: 58, bottomWidth: 58, sleeveLength: 22, armhole: 24.5, sleeveOpening: 20.5, neckRibLength: 2.5, neckOpening: 18.5, shoulderToShoulder: 57 },
    'XL': { totalLength: 73, chestWidth: 60, bottomWidth: 60, sleeveLength: 23, armhole: 25, sleeveOpening: 21, neckRibLength: 2.5, neckOpening: 18.5, shoulderToShoulder: 59 },
    'XXL': { totalLength: 75, chestWidth: 62, bottomWidth: 62, sleeveLength: 24, armhole: 25.5, sleeveOpening: 21.5, neckRibLength: 2.5, neckOpening: 18.5, shoulderToShoulder: 61 }
  };

  const measurements = [
    { id: 'A', label: 'Total Length', key: 'totalLength' },
    { id: 'B', label: 'Chest Width', key: 'chestWidth' },
    { id: 'C', label: 'Bottom Width', key: 'bottomWidth' },
    { id: 'D', label: 'Sleeve Length', key: 'sleeveLength' },
    { id: 'E', label: 'Armhole', key: 'armhole' },
    { id: 'F', label: 'Sleeve Opening', key: 'sleeveOpening' },
    { id: 'G', label: 'Neck Rib Length', key: 'neckRibLength' },
    { id: 'H', label: 'Neck Opening', key: 'neckOpening' },
    { id: 'I', label: 'Shoulder-to-Shoulder', key: 'shoulderToShoulder' }
  ];

  return (
    <div className="size-chart-container">
      <div className="size-chart-header">
        <button className="back-button" onClick={handleMyOrdersClick}>← My orders</button>
        <div className="header-tabs">
          <span className="tab active">Fit</span>
          <span className="tab">Fabric</span>
          <span className="tab">Colourway</span>
          <span className="tab">Necklabel</span>
          <span className="tab">Corelabel</span>
          <span className="tab">Embellishment</span>
          <span className="tab">Finishings</span>
          <span className="tab">Quantity</span>
          <span className="tab">Packaging</span>
          <span className="tab">Delivery</span>
        </div>
        <button className="upgrade-btn">Upgrade plan</button>
      </div>

      <div className="size-chart-content">
        <div className="left-panel">
          <div className="fit-selection">
            <h3>Choose your fit</h3>
            <div className="fit-options">
              {fitOptions.map((option) => (
                <label key={option.id} className="fit-option">
                  <input
                    type="radio"
                    name="fit"
                    value={option.id}
                    checked={selectedFit === option.id}
                    onChange={(e) => setSelectedFit(e.target.value)}
                  />
                  <span className="fit-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="cutting-patterns">
            <h3>Do you have your own cutting patterns?</h3>
            <div className="upload-section">
              <input
                type="file"
                id="image-upload"
                accept=".svg,.png,image/svg+xml,image/png"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <button 
                 className="upload-btn" 
                 onClick={() => document.getElementById('image-upload').click()}
               >
                 Upload
               </button>
              
              {uploadedImage && (
                <div className="uploaded-image-info">
                  <div className="image-details">
                    <span className="image-name">📎 {uploadedImage.name}</span>
                    <button className="remove-btn" onClick={removeImage} title="Supprimer l'image">
                      ❌
                    </button>
                  </div>
                  
                  {imagePreview && (
                    <div className="image-preview">
                      <img 
                        src={imagePreview} 
                        alt="Aperçu du pattern" 
                        className="preview-image"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="size-chart-section">
            <div className="size-chart-header-actions">
              <h3>Fill in the size chart</h3>
              <div className="action-buttons">
                <button 
                  className="save-btn" 
                  onClick={saveToDatabase}
                  disabled={!isModified}
                  title="Sauvegarder le guide des tailles"
                >
                  💾 Sauvegarder
                </button>
                <button 
                  className="load-btn" 
                  onClick={loadSavedQuotes}
                  title="Voir tous les devis sauvegardés"
                >
                  📋 Voir devis
                </button>
                <button 
                  className="stats-btn" 
                  onClick={() => {
                    const stats = database.getStats();
                    alert(`Statistiques de la base de données:\n\n📊 Total devis: ${stats.totalQuotes}\n🖼️ Total images: ${stats.totalImages}\n📎 Devis avec images: ${stats.quotesWithImages}\n💾 Taille stockage: ${stats.totalStorageSize}`);
                  }}
                  title="Statistiques de la base de données"
                >
                  📊 Stats
                </button>
                <button 
                  className="cleanup-btn" 
                  onClick={() => {
                    if (window.confirm('Voulez-vous nettoyer les données anciennes (>30 jours) ?')) {
                      cleanupDatabase();
                    }
                  }}
                  title="Nettoyer les données anciennes"
                >
                  🧹 Nettoyer
                </button>
              </div>
            </div>
            
            <div className="size-chart-table">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>XXS</th>
                    <th>XS</th>
                    <th>S</th>
                    <th>M</th>
                    <th>L</th>
                    <th>XL</th>
                    <th>XXL</th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.map((measurement) => (
                    <tr key={measurement.id}>
                      <td className="measurement-label">
                        <span className="measurement-id">{measurement.id}</span>
                        {measurement.label}
                      </td>
                      {Object.keys(editableSizeData).map((size) => (
                        <td key={size} className="editable-cell">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="200"
                            value={editableSizeData[size]?.[measurement.key] || ''}
                            onChange={(e) => handleCellChange(size, measurement.key, e.target.value)}
                            onBlur={(e) => validateCell(size, measurement.key, e.target.value)}
                            className="size-input"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="diagram-section">
            <div className="tshirt-diagram">
              <svg width="200" height="250" viewBox="0 0 200 250" className="tshirt-svg">
                {/* T-shirt outline */}
                <path 
                  d="M50,50 L75,40 L125,40 L150,50 L140,100 L140,200 L60,200 L60,100 Z" 
                  fill="none" 
                  stroke="#000" 
                  strokeWidth="2"
                />
                
                {/* Neck line */}
                <path 
                  d="M75,40 C85,55 115,55 125,40" 
                  fill="none" 
                  stroke="#000" 
                  strokeWidth="2"
                />
                
                {/* Sleeves */}
                <path d="M50,50 L25,75" stroke="#000" strokeWidth="2" />
                <path d="M150,50 L175,75" stroke="#000" strokeWidth="2" />
                
                {/* Measurement points */}
                <circle cx="100" cy="40" r="3" fill="#000" />
                <circle cx="100" cy="200" r="3" fill="#000" />
                <circle cx="60" cy="75" r="3" fill="#000" />
                <circle cx="140" cy="75" r="3" fill="#000" />
                <circle cx="60" cy="160" r="3" fill="#000" />
                <circle cx="140" cy="160" r="3" fill="#000" />
                <circle cx="25" cy="75" r="3" fill="#000" />
                <circle cx="75" cy="40" r="3" fill="#000" />
                <circle cx="125" cy="40" r="3" fill="#000" />
                
                {/* Measurement labels */}
                <text x="110" y="45" fontSize="12" fill="#000">I</text>
                <text x="110" y="210" fontSize="12" fill="#000">A</text>
                <text x="150" y="80" fontSize="12" fill="#000">B</text>
                <text x="150" y="165" fontSize="12" fill="#000">C</text>
                <text x="15" y="80" fontSize="12" fill="#000">D</text>
                <text x="55" y="75" fontSize="12" fill="#000">E</text>
                <text x="15" y="70" fontSize="12" fill="#000">F</text>
                <text x="85" y="35" fontSize="12" fill="#000">G</text>
                <text x="95" y="55" fontSize="12" fill="#000">H</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SizeChart;