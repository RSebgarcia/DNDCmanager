import { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';

const DBHandler = () => {
    const [campaigns, setCampaigns] = useState([]);

    // Cargar campañas desde localStorage
    useEffect(() => {
        const savedCampaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
        setCampaigns(savedCampaigns);
    }, []);

    const saveCampaignsToLocalStorage = (newCampaigns) => {
        const updatedCampaigns = campaigns.map(campaign => {
            const newCampaign = newCampaigns.find(c => c.id === campaign.id);
            return newCampaign ? { ...campaign, ...newCampaign } : campaign;
        });
    
        newCampaigns.forEach(campaign => {
            if (!updatedCampaigns.find(c => c.id === campaign.id)) {
                updatedCampaigns.push(campaign);
            }
        });
    
        localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
        setCampaigns(updatedCampaigns);
    };

    // Exportar campañas como archivo JSON
    const exportCampaigns = () => {
        const blob = new Blob([JSON.stringify(campaigns, null, 2)], { type: 'application/json' });
        const fileName = 'campaigns.json';
        saveAs(blob, fileName);
    };

    // Cargar campañas desde un archivo JSON
    const importCampaigns = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedCampaigns = JSON.parse(e.target.result);
                if (Array.isArray(importedCampaigns) && importedCampaigns.length <= 3) {
                    importedCampaigns.forEach(campaign => {
                        if (!campaign.id) {
                            throw new Error("Cada campaña debe tener un ID único.");
                        }
                    });
                    saveCampaignsToLocalStorage(importedCampaigns);
                } else {
                    alert("El archivo JSON debe contener un array de campañas y no puede superar el límite de 3 campañas.");
                }
            } catch (error) {
                alert("Error al cargar el archivo JSON. Asegúrate de que el formato sea correcto. " + error.message);
            }
        };
        reader.readAsText(file);
    };

    return {
        campaigns,
        saveCampaignsToLocalStorage,
        exportCampaigns,
        importCampaigns,
    };
};

export default DBHandler;
