// Système de base de données pour la gestion des images et devis
// Utilise localStorage comme simulation de base de données

class Database {
  constructor() {
    this.STORAGE_KEYS = {
      QUOTES: 'sizeChartQuotes',
      IMAGES: 'uploadedImages',
      SETTINGS: 'appSettings'
    };
  }

  // ========== GESTION DES IMAGES ==========
  
  /**
   * Sauvegarde une image dans la base de données
   * @param {File} file - Fichier image
   * @param {string} imagePreview - URL base64 de l'aperçu
   * @returns {string} ID unique de l'image
   */
  saveImage(file, imagePreview) {
    try {
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const imageData = {
        id: imageId,
        name: file.name,
        type: file.type,
        size: file.size,
        preview: imagePreview,
        uploadDate: new Date().toISOString(),
        lastModified: file.lastModified
      };
      
      const existingImages = this.getAllImages();
      existingImages[imageId] = imageData;
      
      localStorage.setItem(this.STORAGE_KEYS.IMAGES, JSON.stringify(existingImages));
      
      console.log('Image sauvegardée:', imageId, imageData.name);
      return imageId;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'image:', error);
      throw new Error('Impossible de sauvegarder l\'image');
    }
  }
  
  /**
   * Récupère toutes les images
   * @returns {Object} Objet contenant toutes les images
   */
  getAllImages() {
    try {
      const images = localStorage.getItem(this.STORAGE_KEYS.IMAGES);
      return images ? JSON.parse(images) : {};
    } catch (error) {
      console.error('Erreur lors de la récupération des images:', error);
      return {};
    }
  }
  
  /**
   * Récupère une image par son ID
   * @param {string} imageId - ID de l'image
   * @returns {Object|null} Données de l'image ou null
   */
  getImageById(imageId) {
    const images = this.getAllImages();
    return images[imageId] || null;
  }
  
  /**
   * Supprime une image
   * @param {string} imageId - ID de l'image à supprimer
   * @returns {boolean} Succès de la suppression
   */
  deleteImage(imageId) {
    try {
      const images = this.getAllImages();
      if (images[imageId]) {
        delete images[imageId];
        localStorage.setItem(this.STORAGE_KEYS.IMAGES, JSON.stringify(images));
        console.log('Image supprimée:', imageId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      return false;
    }
  }

  // ========== GESTION DES DEVIS ==========
  
  /**
   * Sauvegarde un devis complet
   * @param {Object} quoteData - Données du devis
   * @returns {string} ID du devis
   */
  saveQuote(quoteData) {
    try {
      const quoteId = `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const completeQuote = {
        id: quoteId,
        ...quoteData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0'
      };
      
      const existingQuotes = this.getAllQuotes();
      existingQuotes.push(completeQuote);
      
      localStorage.setItem(this.STORAGE_KEYS.QUOTES, JSON.stringify(existingQuotes));
      
      console.log('Devis sauvegardé:', quoteId);
      return quoteId;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du devis:', error);
      throw new Error('Impossible de sauvegarder le devis');
    }
  }
  
  /**
   * Récupère tous les devis
   * @returns {Array} Liste des devis
   */
  getAllQuotes() {
    try {
      const quotes = localStorage.getItem(this.STORAGE_KEYS.QUOTES);
      return quotes ? JSON.parse(quotes) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des devis:', error);
      return [];
    }
  }
  
  /**
   * Récupère un devis par son ID
   * @param {string} quoteId - ID du devis
   * @returns {Object|null} Données du devis ou null
   */
  getQuoteById(quoteId) {
    const quotes = this.getAllQuotes();
    return quotes.find(quote => quote.id === quoteId) || null;
  }
  
  /**
   * Met à jour un devis existant
   * @param {string} quoteId - ID du devis
   * @param {Object} updateData - Nouvelles données
   * @returns {boolean} Succès de la mise à jour
   */
  updateQuote(quoteId, updateData) {
    try {
      const quotes = this.getAllQuotes();
      const quoteIndex = quotes.findIndex(quote => quote.id === quoteId);
      
      if (quoteIndex !== -1) {
        quotes[quoteIndex] = {
          ...quotes[quoteIndex],
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem(this.STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
        console.log('Devis mis à jour:', quoteId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du devis:', error);
      return false;
    }
  }
  
  /**
   * Supprime un devis
   * @param {string} quoteId - ID du devis à supprimer
   * @returns {boolean} Succès de la suppression
   */
  deleteQuote(quoteId) {
    try {
      const quotes = this.getAllQuotes();
      const filteredQuotes = quotes.filter(quote => quote.id !== quoteId);
      
      if (filteredQuotes.length !== quotes.length) {
        localStorage.setItem(this.STORAGE_KEYS.QUOTES, JSON.stringify(filteredQuotes));
        console.log('Devis supprimé:', quoteId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la suppression du devis:', error);
      return false;
    }
  }

  // ========== FONCTIONS UTILITAIRES ==========
  
  /**
   * Recherche des devis par critères
   * @param {Object} criteria - Critères de recherche
   * @returns {Array} Devis correspondants
   */
  searchQuotes(criteria = {}) {
    const quotes = this.getAllQuotes();
    
    return quotes.filter(quote => {
      if (criteria.fit && quote.fit !== criteria.fit) return false;
      if (criteria.dateFrom && new Date(quote.createdAt) < new Date(criteria.dateFrom)) return false;
      if (criteria.dateTo && new Date(quote.createdAt) > new Date(criteria.dateTo)) return false;
      if (criteria.hasImage && !quote.uploadedImage) return false;
      
      return true;
    });
  }
  
  /**
   * Nettoie les données obsolètes
   * @param {number} daysOld - Nombre de jours pour considérer les données comme obsolètes
   */
  cleanupOldData(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      // Nettoyer les devis anciens
      const quotes = this.getAllQuotes();
      const recentQuotes = quotes.filter(quote => 
        new Date(quote.createdAt) > cutoffDate
      );
      
      if (recentQuotes.length !== quotes.length) {
        localStorage.setItem(this.STORAGE_KEYS.QUOTES, JSON.stringify(recentQuotes));
        console.log(`${quotes.length - recentQuotes.length} devis anciens supprimés`);
      }
      
      // Nettoyer les images non utilisées
      const images = this.getAllImages();
      const usedImageIds = recentQuotes
        .filter(quote => quote.uploadedImage && quote.uploadedImage.id)
        .map(quote => quote.uploadedImage.id);
      
      const cleanedImages = {};
      Object.keys(images).forEach(imageId => {
        if (usedImageIds.includes(imageId) || 
            new Date(images[imageId].uploadDate) > cutoffDate) {
          cleanedImages[imageId] = images[imageId];
        }
      });
      
      localStorage.setItem(this.STORAGE_KEYS.IMAGES, JSON.stringify(cleanedImages));
      
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
    }
  }
  
  /**
   * Exporte toutes les données
   * @returns {Object} Toutes les données de l'application
   */
  exportAllData() {
    return {
      quotes: this.getAllQuotes(),
      images: this.getAllImages(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  }
  
  /**
   * Importe des données
   * @param {Object} data - Données à importer
   * @returns {boolean} Succès de l'importation
   */
  importData(data) {
    try {
      if (data.quotes) {
        localStorage.setItem(this.STORAGE_KEYS.QUOTES, JSON.stringify(data.quotes));
      }
      if (data.images) {
        localStorage.setItem(this.STORAGE_KEYS.IMAGES, JSON.stringify(data.images));
      }
      console.log('Données importées avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      return false;
    }
  }
  
  /**
   * Obtient les statistiques de la base de données
   * @returns {Object} Statistiques
   */
  getStats() {
    const quotes = this.getAllQuotes();
    const images = this.getAllImages();
    
    return {
      totalQuotes: quotes.length,
      totalImages: Object.keys(images).length,
      quotesWithImages: quotes.filter(q => q.uploadedImage).length,
      totalStorageSize: this.calculateStorageSize(),
      oldestQuote: quotes.length > 0 ? Math.min(...quotes.map(q => new Date(q.createdAt))) : null,
      newestQuote: quotes.length > 0 ? Math.max(...quotes.map(q => new Date(q.createdAt))) : null
    };
  }
  
  /**
   * Calcule la taille approximative du stockage
   * @returns {string} Taille formatée
   */
  calculateStorageSize() {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length;
        }
      }
      
      // Convertir en unités lisibles
      if (totalSize < 1024) return totalSize + ' B';
      if (totalSize < 1024 * 1024) return (totalSize / 1024).toFixed(2) + ' KB';
      return (totalSize / (1024 * 1024)).toFixed(2) + ' MB';
    } catch (error) {
      return 'Inconnu';
    }
  }
}

// Instance singleton de la base de données
const database = new Database();

export default database;

// Exports nommés pour faciliter l'utilisation
export {
  Database
};