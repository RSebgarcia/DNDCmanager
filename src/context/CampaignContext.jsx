// src/context/CampaignContext.js
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Container,Row,Col,Button } from 'react-bootstrap';
const CampaignContext = createContext();

export const useCampaign = () => {
    return useContext(CampaignContext);
};

export const CampaignProvider = ({ children }) => {
    const [campaign, setCampaign] = useState(null);
    const [campaignId, setCampaignId] = useState(null);
    const [fantasyTimestamp, setFantasyTimestamp] = useState(new Date());
    const [enemies, setEnemies] = useState([]);

    useEffect(() => {
        const loadedCampaign = JSON.parse(localStorage.getItem('currentCampaign'));
        if (loadedCampaign) {
            setCampaign(loadedCampaign);
            setCampaignId(loadedCampaign.id);
            const lastGameTimestamp = localStorage.getItem(`campaign_${loadedCampaign.id}_lastGameTimestamp`);
            if (lastGameTimestamp) {
                const timestamp = new Date(lastGameTimestamp);
                if (!isNaN(timestamp.getTime())) {
                    setFantasyTimestamp(timestamp);
                } else {
                    setFantasyTimestamp(new Date(loadedCampaign.startDate));
                }
            } else {
                setFantasyTimestamp(new Date(loadedCampaign.startDate));
            }
        }
    }, []);

    const handleSaveTimestamp = useCallback((timestamp) => {
        if (!campaignId) return;

        if (timestamp instanceof Date && !isNaN(timestamp.getTime())) {
            localStorage.setItem(`campaign_${campaignId}_lastGameTimestamp`, timestamp.toISOString());
            const currentCampaign = { ...campaign, lastGameTimestamp: timestamp.toISOString() };
            localStorage.setItem('currentCampaign', JSON.stringify(currentCampaign));
            setCampaign(currentCampaign);  // Update campaign state
        }
    }, [campaign, campaignId]);

    const handleAddEnemy = (enemy) => {
        setEnemies((prevEnemies) => [...prevEnemies, enemy]);
    };

    const value = {
        campaign,
        campaignId,
        fantasyTimestamp,
        enemies,
        setFantasyTimestamp,
        handleSaveTimestamp,
        handleAddEnemy,
    };

    return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
};
