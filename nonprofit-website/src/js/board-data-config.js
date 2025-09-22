// Board Data Configuration
// Configuration for dynamic board member data

const BOARD_DATA_CONFIG = {
    // Azure Function API endpoint for board data (has CORS enabled)
    dataUrl: 'https://harambee-board-api.azurewebsites.net/api/board-members',
    
    // Enable/disable dynamic data loading
    enabled: true,
    
    // Debug mode - logs API calls to console
    debug: false
};

// Board Data API helper functions
class BoardDataAPI {
    static async fetchBoardMembers() {
        if (!BOARD_DATA_CONFIG.enabled) {
            if (BOARD_DATA_CONFIG.debug) {
                console.log('Board data integration disabled, using fallback data');
            }
            return null;
        }

        try {
            if (BOARD_DATA_CONFIG.debug) {
                console.log('Fetching board data from:', BOARD_DATA_CONFIG.dataUrl);
            }

            const response = await fetch(BOARD_DATA_CONFIG.dataUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Data fetch error: ${response.status} ${response.statusText}`);
            }

            const boardMembers = await response.json();
            
            if (BOARD_DATA_CONFIG.debug) {
                console.log('Board members loaded:', boardMembers);
            }

            return boardMembers;

        } catch (error) {
            console.error('Board data fetch error:', error);
            return null;
        }
    }
}