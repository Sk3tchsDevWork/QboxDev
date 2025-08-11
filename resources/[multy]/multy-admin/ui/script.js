let selectedPlayer = null;
let menuVisible = false;
let devToggles = {
    coords: false,
    noclip: false,
    godmode: false,
    invisible: false,
    entityInfo: false,
    playerBlips: false,
    playerNames: false,
    timeFrozen: false
};
let permissions = {};
let permissionLevel = null;
let vehicleCategories = {};
let pedCategories = {};
let vehicleSettings = {};
let translations = {};
let teleportLocations = {};
let claimInProgress = false;

function hasPermission(feature) {
    return permissions[feature] !== false;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `feedback-toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function setButtonLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

const resourceName = (window.GetParentResourceName && typeof window.GetParentResourceName === 'function') 
    ? window.GetParentResourceName() 
    : 'qb-adminmenu';
function t(key, fallback) {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return fallback || key;
        }
    }
    
    return value || fallback || key;
}

function updateUITranslations() {
    const titleElement = document.querySelector('.menu-header h1');
    if (titleElement) {
        titleElement.innerHTML = `<img src="https://multy.lol/logo.png" alt="Multy" class="menu-logo"> ${t('menu_title', 'Multy Admin')}`;
    }
    
    document.querySelector('[data-tab="players"]').innerHTML = `<i class="fas fa-users"></i> ${t('player_management', 'Players')}`;
    document.querySelector('[data-tab="vehicle"]').innerHTML = `<i class="fas fa-car"></i> ${t('vehicle_options', 'Vehicle')}`;
    document.querySelector('[data-tab="world"]').innerHTML = `<i class="fas fa-globe"></i> ${t('weather_time', 'World')}`;
    document.querySelector('[data-tab="server"]').innerHTML = `<i class="fas fa-server"></i> ${t('server_management', 'Server')}`;
    document.querySelector('[data-tab="teleport"]').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${t('teleport_options', 'Teleport')}`;
    document.querySelector('[data-tab="developer"]').innerHTML = `<i class="fas fa-code"></i> ${t('developer_options', 'Developer')}`;
    document.querySelector('[data-tab="reports"]').innerHTML = `<i class="fas fa-flag"></i> ${t('reports', 'Reports')} <span id="reportCount" class="report-badge" style="display: none;">0</span>`;
    document.querySelector('[data-tab="adminchat"]').innerHTML = `<i class="fas fa-comments"></i> ${t('admin_chat', 'Admin Chat')} <span id="adminChatUnread" class="report-badge" style="display: none;">0</span>`;
    
    const playerSection = document.getElementById('players');
    if (playerSection) {
        playerSection.querySelector('h2').textContent = t('player_management', 'Player Management');
        playerSection.querySelector('#playerSearch').placeholder = t('search_players', 'Search by ID, character name, or FiveM name...');
        
        const optionButtons = playerSection.querySelectorAll('.option-btn');
        const buttonTranslations = [
            { selector: 'showPlayerInfo', key: 'player_info' },
            { selector: 'spectatePlayer', key: 'spectate' },
            { selector: 'teleportToPlayer', key: 'teleport_to_player' },
            { selector: 'bringPlayer', key: 'bring_player' },
            { selector: 'sendPlayerBack', key: 'return_player' },
            { selector: 'freezePlayer', key: 'freeze' },
            { selector: 'revivePlayer', key: 'heal' },
            { selector: 'killPlayer', key: 'kill' },
            { selector: 'screenshotPlayer', key: 'screenshot' },
            { selector: 'warnPlayer', key: 'warn' },
            { selector: 'kickPlayer', key: 'kick' },
            { selector: 'banPlayer', key: 'ban' },
            { selector: 'openInventory', key: 'open_inventory' },
            { selector: 'clearInventory', key: 'clear_inventory' },
            { selector: 'setJob', key: 'set_job' },
            { selector: 'setGang', key: 'set_gang' },
            { selector: 'giveItem', key: 'give_item' },
            { selector: 'giveMoney', key: 'give_money' },
            { selector: 'giveCar', key: 'give_car' },
            { selector: 'fixPlayerCar', key: 'fix_car' },
            { selector: 'giveClothingMenu', key: 'give_clothing_menu' },
            { selector: 'removePlayerCar', key: 'remove_player_car' },
            { selector: 'revivePlayer', key: 'revive' }
        ];
        
        buttonTranslations.forEach(btn => {
            const element = playerSection.querySelector(`[onclick*="${btn.selector}"]`);
            if (element) {
                const icon = element.querySelector('i');
                const iconClass = icon ? icon.className : '';
                element.innerHTML = `<i class="${iconClass}"></i> ${t(btn.key, btn.key.replace(/_/g, ' '))}`;
            }
        });
    }
    
    updateVehicleTranslations();
    updateWorldTranslations();
    updateServerTranslations();
    updateTeleportTranslations();
    updateDeveloperTranslations();
    updateReportsTranslations();
    updateAdminChatTranslations();
    updateModalButtonTranslations();
    updateReportFormTranslations();
    updateAnnouncementTranslations();
    updateReportDetailsTranslations();
}

function updateReportFormTranslations() {
    const reportForm = document.getElementById('reportFormModal');
    if (reportForm) {
        const title = reportForm.querySelector('.report-form-header h2');
        if (title) title.innerHTML = `<i class="fas fa-flag"></i> ${t('submit_report', 'Submit Report')}`;
        
        const cancelBtn = document.getElementById('reportCancelBtn');
        if (cancelBtn) cancelBtn.textContent = t('cancel', 'Cancel');
        
        const submitBtn = document.getElementById('reportSubmitBtn');
        if (submitBtn) submitBtn.textContent = t('submit_report', 'Submit Report');
        
        const labels = reportForm.querySelectorAll('label');
        const labelKeys = ['report_type', 'select_player', 'subject', 'description'];
        labels.forEach((label, index) => {
            if (labelKeys[index]) {
                label.textContent = t(labelKeys[index], label.textContent);
            }
        });
        
        const subjectInput = document.getElementById('reportSubjectInput');
        if (subjectInput) subjectInput.placeholder = t('brief_description', 'Brief description...');
        
        const messageInput = document.getElementById('reportMessageInput');
        if (messageInput) messageInput.placeholder = t('describe_report', 'Describe your report in detail...');
        
        const targetSelect = document.getElementById('targetPlayerSelect');
        if (targetSelect && targetSelect.options[0]) {
            targetSelect.options[0].textContent = t('select_player_dropdown', 'Select a player...');
        }
    }
}

function updateAnnouncementTranslations() {
    const announcementTitle = document.getElementById('announcementTitle');
    if (announcementTitle) {
        announcementTitle.textContent = t('server_announcement', 'SERVER ANNOUNCEMENT');
    }
}

function updateReportDetailsTranslations() {
    const reportDetails = document.getElementById('reportDetails');
    if (reportDetails) {
        const infoRows = reportDetails.querySelectorAll('.info-row label');
        const labelKeys = ['reporter', 'reported_player', 'claimed_by', 'created'];
        infoRows.forEach((label, index) => {
            if (labelKeys[index]) {
                label.textContent = t(labelKeys[index], label.textContent) + ':';
            }
        });
        
        const replyInput = document.getElementById('reportReply');
        if (replyInput) {
            replyInput.placeholder = t('type_response', 'Type your response...');
        }
    }
}

window.addEventListener('message', function(event) {
    const data = event.data;
    
    switch(data.action) {
        case 'show':
            if (data.permissions) {
                permissions = data.permissions;
                permissionLevel = data.permLevel;
                applyPermissions();
            }
            if (data.translations) {
                translations = data.translations;
                updateUITranslations();
            }
            if (data.teleportLocations) {
                teleportLocations = data.teleportLocations;
                updateTeleportLocations();
            }
            showMenu();
            break;
        case 'hide':
            hideMenu();
            break;
        case 'closePlayerOptions':
            closePlayerOptions();
            break;
        case 'updatePlayers':
            updatePlayerList(data.players);
            break;
        case 'updateServerInfo':
            updateServerInfo(data.info);
            break;
        case 'updateToggles':
            updateDevToggles(data.toggles);
            break;
        case 'updatePermissions':
            permissions = data.permissions || {};
            permissionLevel = data.permLevel;
            applyPermissions();
            break;
        case 'copyToClipboard':
            copyToClipboard(data.text);
            break;
        case 'showAnnouncement':
            showAnnouncement(data.message);
            break;
        case 'updateVehicleCategories':
            vehicleCategories = data.categories || {};
            populateVehicleCategories();
            break;
        case 'updatePedCategories':
            pedCategories = data.categories || {};
            break;
        case 'updateVehicleSettings':
            vehicleSettings = data.settings || {};
            break;
        case 'closeModal':
            closeCurrentModal();
            break;
        case 'receivePlayerVehicles':
            handlePlayerVehicles(data.vehicles);
            break;
        case 'receiveAdminChatMessage':
            receiveAdminChatMessage(data.message);
            break;
        case 'loadAdminChatHistory':
            loadAdminChatMessages(data.messages);
            break;
        case 'clearAdminChat':
            adminChatMessages = [];
            document.getElementById('adminChatMessages').innerHTML = '';
            break;
        case 'showPlayerInfo':
            displayPlayerInfo(data.playerInfo);
            break;
    }
});

function showAnnouncement(message) {
    const container = document.getElementById('announcementContainer');
    const textElement = document.getElementById('announcementText');
    
    textElement.textContent = message;
    container.style.display = 'block';
    container.classList.remove('fade-out');
    
    setTimeout(() => {
        container.classList.add('fade-out');
        setTimeout(() => {
            container.style.display = 'none';
        }, 500);
    }, 10000);
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function applyPermissions() {
    const tabs = document.querySelectorAll('.menu-tab');
    tabs.forEach(tab => {
        const tabName = tab.getAttribute('data-tab');
        const tabPermissionMap = {
            'players': 'playerManagement',
            'vehicles': 'vehicleMenu',
            'world': 'worldOptions',
            'server': 'serverManagement',
            'teleport': 'teleportOptions',
            'developer': 'devOptions',
            'reports': 'viewReports',
            'bans': 'viewBans'
        };
        
        const permissionFeature = tabPermissionMap[tabName];
        if (permissionFeature && permissions[permissionFeature] === false) {
            tab.style.display = 'none';
        } else {
            tab.style.display = '';
        }
    });
    
    const permissionButtons = {
        'spectateBtn': 'spectate',
        'reviveBtn': 'heal',
        'killBtn': 'kill',
        'freezeBtn': 'freeze',
        'teleportToBtn': 'teleportToPlayer',
        'bringBtn': 'bringPlayer',
        'kickBtn': 'kick',
        'banBtn': 'ban',
        'screenshotBtn': 'screenshot',
        'giveItemBtn': 'giveItem',
        'giveMoneyBtn': 'giveMoney',
        'setJobBtn': 'setJob',
        'openInventoryBtn': 'openInventory',
        'clearInventoryBtn': 'clearInventory',
        
        'spawnVehicleBtn': 'spawnVehicle',
        'deleteVehicleBtn': 'deleteVehicle',
        'repairVehicleBtn': 'repairVehicle',
        'flipVehicleBtn': 'flipVehicle',
        'maxTuneBtn': 'maxTuneVehicle',
        'changePlateBtn': 'changePlate',
        
        'setWeatherBtn': 'changeWeather',
        'setTimeBtn': 'changeTime',
        
        'reviveAllBtn': 'reviveAll',
        'giveItemAllBtn': 'giveItemAll',
        'giveMoneyAllBtn': 'giveMoneyAll',
        'clearAreaBtn': 'clearArea',
        'clearVehiclesBtn': 'clearAllVehicles',
        'announceBtn': 'announcement',
        'refreshJobsBtn': 'refreshJobs',
        'refreshItemsBtn': 'refreshItems',
        
        'teleportWaypointBtn': 'teleportWaypoint',
        'teleportCoordsBtn': 'teleportCoords',
        'teleportLocationBtn': 'teleportLocations',
        'returnLocationBtn': 'returnLastLocation',
        
        'toggleCoordsBtn': 'showCoords',
        'toggleNoclipBtn': 'noclip',
        'toggleGodmodeBtn': 'godmode',
        'toggleInvisibleBtn': 'invisible',
        'toggleEntityInfoBtn': 'entityInfo',
        'togglePlayerBlipsBtn': 'playerBlips',
        'togglePlayerNamesBtn': 'playerNames',
        'toggleInfiniteAmmoBtn': 'infiniteAmmo',
        'copyCoordsBtn': 'copyCoords'
    };
    
    for (const [buttonId, permissionKey] of Object.entries(permissionButtons)) {
        const button = document.getElementById(buttonId);
        if (button) {
            if (permissions[permissionKey] === false) {
                button.style.display = 'none';
            } else {
                button.style.display = '';
            }
        }
    }
    
    const menuTitle = document.querySelector('.menu-header h2');
    if (menuTitle && permissionLevel) {
        menuTitle.textContent = `Admin Menu [${permissionLevel}]`;
    }
    
    const activeTab = document.querySelector('.menu-tab.active');
    if (activeTab && activeTab.style.display === 'none') {
        const firstVisibleTab = document.querySelector('.menu-tab:not([style*="display: none"])');
        if (firstVisibleTab) {
            firstVisibleTab.click();
        }
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (document.getElementById('playerOptions').style.display === 'block') {
            closePlayerOptions();
        } else if (menuVisible) {
            closeMenu();
        }
    }
    
    if (event.key === 'Enter' && event.target.id === 'playerSearch') {
        event.preventDefault();
    }
});

document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const tabId = this.dataset.tab;
        if (!tabId) {
            console.error('Tab ID not found in dataset');
            return;
        }
        
        switchTab(tabId);
        
        currentTab = tabId;
        
        handleTabSwitch(tabId);
        
        if (tabId === 'adminchat') {
            unreadMessages = 0;
            updateUnreadBadge();
        }
        
        if (tabId === "reports") {
            fetch(`https://${resourceName}/getReports`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            });
        }
        
        setTimeout(() => {
            try {
                const activeTabElement = document.querySelector(`#${tabId}.tab-content`);
                if (activeTabElement) {
                    const firstInput = activeTabElement.querySelector('input[type="text"], input[type="number"], textarea');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }
            } catch (error) {
                console.error('Error focusing input:', error);
            }
        }, 100);
    });
});

function showMenu() {
    document.getElementById('adminMenu').style.display = 'block';
    menuVisible = true;
    fetchPlayers();
    fetchServerInfo();
    initializeAdminChat();
}

function hideMenu() {
    document.getElementById('adminMenu').style.display = 'none';
    menuVisible = false;
}

function closeMenu() {
    hideMenu();
    closePlayerOptions();
    if (!resourceName) {
        console.error('Resource name is not defined');
        return;
    }
    fetch(`https://${resourceName}/close`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    }).catch(error => {
        console.error('Error closing menu:', error);
    });
}

function fetchPlayers() {
    if (!resourceName) {
        console.error('Resource name is not defined for fetchPlayers');
        return;
    }
    fetch(`https://${resourceName}/getPlayers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).catch(error => {
        console.error('Error fetching players:', error);
    });
}

function fetchServerInfo() {
    if (!resourceName) {
        console.error('Resource name is not defined for fetchServerInfo');
        return;
    }
    fetch(`https://${resourceName}/getServerInfo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).catch(error => {
        console.error('Error fetching server info:', error);
    });
}

function formatPlaytime(minutes) {
    if (!minutes || minutes === 0) {
        return 'Just joined';
    }
    if (minutes < 60) {
        return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

function updatePlayerList(players) {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    
    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        
        const firstLetter = player.name ? player.name.charAt(0).toUpperCase() : '?';
        
        playerCard.innerHTML = `
            <div class="player-card-badge">ID: ${player.id}</div>
            <div class="player-card-header">
                <div class="player-avatar">${firstLetter}</div>
                <div class="player-card-info">
                    <div class="player-name">${player.name || 'Unknown'}</div>
                    <div class="player-fivem-name">${player.fivemName || 'Unknown'}</div>
                </div>
            </div>
            <div class="player-stats">
                <div class="player-stat">
                    <i class="fas fa-heart"></i>
                    <span class="player-stat-label">Health</span>
                    <span class="player-stat-value">${Math.round((player.health || 200) / 2)}%</span>
                </div>
                <div class="player-stat">
                    <i class="fas fa-shield-alt"></i>
                    <span class="player-stat-label">Armor</span>
                    <span class="player-stat-value">${player.armor || 0}%</span>
                </div>
                <div class="player-stat">
                    <i class="fas fa-network-wired"></i>
                    <span class="player-stat-label">Ping</span>
                    <span class="player-stat-value">${player.ping || 0}ms</span>
                </div>
                <div class="player-stat">
                    <i class="fas fa-clock"></i>
                    <span class="player-stat-label">Playtime</span>
                    <span class="player-stat-value">${formatPlaytime(player.sessionTime || 0)}</span>
                </div>
            </div>
        `;
        
        playerCard.addEventListener('click', function() {
            selectPlayer(player, this);
        });
        
        playerList.appendChild(playerCard);
    });
}

function selectPlayer(player, element) {
    selectedPlayer = player;
    
    document.querySelectorAll('.player-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    if (element) {
        element.classList.add('selected');
    }
    
    const displayName = `[${player.id}] ${player.name}`;
    document.getElementById('selectedPlayerName').textContent = displayName;
    document.getElementById('playerOptions').style.display = 'block';
}

function closePlayerOptions() {
    document.getElementById('playerOptions').style.display = 'none';
    document.querySelectorAll('.player-card').forEach(card => {
        card.classList.remove('selected');
    });
    selectedPlayer = null;
}

function updateServerInfo(info) {
    document.getElementById('playersOnline').textContent = info.playersOnline || 0;
    document.getElementById('maxPlayers').textContent = info.maxPlayers || 0;
    document.getElementById('serverUptime').textContent = info.uptime || '0h 0m';
}

function updateDevToggles(toggles) {
    devToggles = toggles;
    
    const toggleButtons = {
        coordsToggle: toggles.coords,
        noclipToggle: toggles.noclip,
        godModeToggle: toggles.godmode,
        invisibleToggle: toggles.invisible,
        entityInfoToggle: toggles.entityInfo,
        playerBlipsToggle: toggles.playerBlips,
        playerNamesToggle: toggles.playerNames,
        freezeTimeToggle: toggles.timeFrozen
    };
    
    for (const [buttonId, isActive] of Object.entries(toggleButtons)) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.remove('active', 'inactive');
            button.classList.add(isActive ? 'active' : 'inactive');
        }
    }
}

function sendCommand(command, data = {}) {
    if (!resourceName) {
        console.error('Resource name is not defined for sendCommand');
        return;
    }
    fetch(`https://${resourceName}/${command}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).catch(error => {
        console.error('Error sending command:', error);
    });
}

function spectatePlayer() {
    if (!selectedPlayer) return;
    sendCommand('spectatePlayer', { playerId: selectedPlayer.id });
}

function teleportToPlayer() {
    if (!selectedPlayer) return;
    sendCommand('teleportToPlayer', { playerId: selectedPlayer.id });
}

function bringPlayer() {
    if (!selectedPlayer) return;
    sendCommand('bringPlayer', { playerId: selectedPlayer.id });
}

function sendPlayerBack() {
    if (!selectedPlayer) return;
    sendCommand('sendPlayerBack', { playerId: selectedPlayer.id });
}

function freezePlayer() {
    if (!selectedPlayer) return;
    sendCommand('freezePlayer', { playerId: selectedPlayer.id });
}

function revivePlayer() {
    if (!selectedPlayer) return;
    sendCommand('revivePlayer', { playerId: selectedPlayer.id });
}

function killPlayer() {
    if (!selectedPlayer) return;
    sendCommand('killPlayer', { playerId: selectedPlayer.id });
}

function showPlayerInfo() {
    if (!selectedPlayer) return;
    sendCommand('getPlayerInfo', { playerId: selectedPlayer.id });
}

function displayPlayerInfo(playerInfo) {
    const info = playerInfo;
    let content = `
        <div style="max-height: 400px; overflow-y: auto; padding: 10px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                    <h4 style="color: #3b82f6; margin-bottom: 10px; border-bottom: 1px solid #374151; padding-bottom: 5px;">${t('basic_information', 'Basic Information')}</h4>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div><strong>${t('fivem_name', 'FiveM Name')}:</strong> ${info.name || 'Unknown'}</div>
                        <div><strong>${t('player_id', 'Server ID')}:</strong> ${info.id || 'Unknown'}</div>
                        <div><strong>${t('character_name', 'Character')}:</strong> ${info.charname || 'Unknown'}</div>
                        <div><strong>${t('phone', 'Phone')}:</strong> ${info.phone || 'N/A'}</div>
                        <div><strong>${t('date_of_birth', 'Date of Birth')}:</strong> ${info.dob || 'Unknown'}</div>
                        <div><strong>${t('gender', 'Gender')}:</strong> ${info.gender ? t(info.gender.toLowerCase(), info.gender) : 'Unknown'}</div>
                    </div>
                </div>
                <div>
                    <h4 style="color: #3b82f6; margin-bottom: 10px; border-bottom: 1px solid #374151; padding-bottom: 5px;">${t('employment', 'Employment')}</h4>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div><strong>${t('job', 'Job')}:</strong> ${info.job?.label || t('unemployed', 'Unemployed')}</div>
                        <div><strong>${t('grade', 'Grade')}:</strong> ${info.job?.grade_label || 'N/A'} (${info.job?.grade || 0})</div>
                        <div><strong>${t('on_duty', 'On Duty')}:</strong> ${info.job?.onduty ? t('yes', 'Yes') : t('no', 'No')}</div>
                        <div><strong>${t('gang', 'Gang')}:</strong> ${info.gang?.label || t('none', 'None')}</div>
                        <div><strong>${t('gang_grade', 'Gang Grade')}:</strong> ${info.gang?.grade_label || 'N/A'}</div>
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                    <h4 style="color: #3b82f6; margin-bottom: 10px; border-bottom: 1px solid #374151; padding-bottom: 5px;">${t('financial', 'Financial')}</h4>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div><strong>${t('cash', 'Cash')}:</strong> $${info.money?.cash?.toLocaleString() || '0'}</div>
                        <div><strong>${t('bank', 'Bank')}:</strong> $${info.money?.bank?.toLocaleString() || '0'}</div>
                        <div><strong>${t('crypto', 'Crypto')}:</strong> $${info.money?.crypto?.toLocaleString() || '0'}</div>
                    </div>
                </div>
                <div>
                    <h4 style="color: #3b82f6; margin-bottom: 10px; border-bottom: 1px solid #374151; padding-bottom: 5px;">${t('technical', 'Technical')}</h4>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div><strong>${t('ping', 'Ping')}:</strong> ${info.ping || t('unknown', 'Unknown')}ms</div>
                        ${info.ipAddress ? `
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div><strong>${t('ip_address', 'IP Address')}:</strong> <span style="font-family: monospace; background: rgba(255,0,0,0.1); padding: 2px 4px; border-radius: 4px;">${info.ipAddress}</span></div>
                                <button onclick="copyToClipboard('${info.ipAddress}')" style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: 10px;">
                                    <i class="fas fa-copy"></i> ${t('copy', 'Copy')}
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div>
                <h4 style="color: #3b82f6; margin-bottom: 10px; border-bottom: 1px solid #374151; padding-bottom: 5px;">${t('player_licenses', 'Player Licenses')}</h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${info.identifiers && info.identifiers.length > 0 ? 
                        info.identifiers
                            .filter(identifier => !identifier.startsWith('ip:'))
                            .map(identifier => `
                            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px;">
                                <span style="font-family: monospace; word-break: break-all; flex: 1; margin-right: 10px;">${identifier}</span>
                                <button onclick="copyToClipboard('${identifier}')" style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                                    <i class="fas fa-copy"></i> ${t('copy', 'Copy')}
                                </button>
                            </div>
                        `).join('') 
                        : '<div>' + t('no_identifiers', 'No identifiers found') + '</div>'
                    }
                </div>
            </div>
            
            <div>
                <h4 style="color: #3b82f6; margin-bottom: 10px; border-bottom: 1px solid #374151; padding-bottom: 5px;">${t('game_stats', 'Game Stats')}</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                    <div><strong>${t('health', 'Health')}:</strong> ${info.health || t('unknown', 'Unknown')}</div>
                    <div><strong>${t('armor', 'Armor')}:</strong> ${info.armor || t('unknown', 'Unknown')}</div>
                    <div><strong>${t('stress', 'Stress')}:</strong> ${info.stress || t('unknown', 'Unknown')}</div>
                    <div><strong>${t('hunger', 'Hunger')}:</strong> ${info.hunger || t('unknown', 'Unknown')}</div>
                    <div><strong>${t('thirst', 'Thirst')}:</strong> ${info.thirst || t('unknown', 'Unknown')}</div>
                    <div><strong>${t('in_vehicle', 'In Vehicle')}:</strong> ${info.inVehicle ? t('yes', 'Yes') : t('no', 'No')}</div>
                </div>
            </div>
            
            ${info.position ? `
                <div style="margin-top: 15px;">
                    <h4 style="color: #3b82f6; margin-bottom: 10px; border-bottom: 1px solid #374151; padding-bottom: 5px;">${t('position', 'Position')}</h4>
                    <div style="font-family: monospace; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px;">
                        X: ${info.position.x?.toFixed(2) || t('unknown', 'Unknown')}, Y: ${info.position.y?.toFixed(2) || t('unknown', 'Unknown')}, Z: ${info.position.z?.toFixed(2) || t('unknown', 'Unknown')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    showModal(`${t('player_information', 'Player Information')} - ${info.charname || info.name || 'Unknown'}`, content, null, false);
}

function screenshotPlayer() {
    if (!selectedPlayer) return;
    sendCommand('screenshotPlayer', { playerId: selectedPlayer.id });
}

function warnPlayer() {
    if (!selectedPlayer) return;
    showModal('Warn Player', modalTemplates.warnPlayer(), () => {
        const message = document.getElementById('warnMessage').value;
        if (message) {
            sendCommand('warnPlayer', { playerId: selectedPlayer.id, message: message });
        }
    });
}

function kickPlayer() {
    if (!selectedPlayer) return;
    showModal(t('kick', 'Kick Player'), modalTemplates.kickPlayer(), () => {
        const reason = document.getElementById('kickReason').value;
        if (reason) {
            sendCommand('kickPlayer', { playerId: selectedPlayer.id, reason: reason });
        }
    });
}

function banPlayer() {
    if (!selectedPlayer) return;
    showModal(t('ban', 'Ban Player'), modalTemplates.banPlayer(), () => {
        const reason = document.getElementById('banReason').value;
        const duration = document.getElementById('banDuration').value;
        if (reason && duration !== null) {
            const playerName = selectedPlayer.name;
            sendCommand('banPlayer', { 
                playerId: selectedPlayer.id, 
                reason: reason,
                duration: parseInt(duration)
            });
            closePlayerOptions();
            showToast(`Banning ${playerName}...`, 'info');
        }
    });
}

function giveItem() {
    if (!selectedPlayer) return;
    showModal(t('give_item', 'Give Item'), modalTemplates.giveItem(), () => {
        const item = document.getElementById('itemName').value;
        const amount = document.getElementById('itemAmount').value;
        if (item && amount) {
            sendCommand('giveItem', { 
                playerId: selectedPlayer.id, 
                item: item,
                amount: parseInt(amount)
            });
        }
    });
}

function giveMoney() {
    if (!selectedPlayer) return;
    showModal(t('give_money', 'Give Money'), modalTemplates.giveMoney(), () => {
        const type = document.getElementById('moneyType').value;
        const amount = document.getElementById('moneyAmount').value;
        if (type && amount) {
            sendCommand('giveMoney', { 
                playerId: selectedPlayer.id, 
                type: type,
                amount: parseInt(amount)
            });
        }
    });
}

function giveCar() {
    if (!selectedPlayer) return;
    showModal(t('give_car', 'Give Car'), modalTemplates.giveCar(), () => {
        const model = document.getElementById('carModel').value;
        const garage = document.getElementById('garageType').value;
        const plateType = document.getElementById('plateType').value;
        const customPlate = document.getElementById('customPlate').value;
        
        if (model) {
            const plateData = {
                type: plateType,
                custom: plateType === 'custom' ? customPlate : null
            };
            
            sendCommand('giveCar', { 
                playerId: selectedPlayer.id, 
                model: model,
                garage: garage || 'pillboxgarage',
                plate: plateData
            });
        }
    });
}

function toggleCustomPlate() {
    const plateType = document.getElementById('plateType').value;
    const customPlateInput = document.getElementById('customPlate');
    
    if (plateType === 'custom') {
        customPlateInput.style.display = 'block';
        customPlateInput.focus();
    } else {
        customPlateInput.style.display = 'none';
        customPlateInput.value = '';
    }
}

function setJob() {
    if (!selectedPlayer) return;
    showModal(t('set_job', 'Set Job'), modalTemplates.setJob(), () => {
        const job = document.getElementById('jobName').value;
        const grade = document.getElementById('jobGrade').value;
        if (job && grade !== null) {
            sendCommand('setJob', { 
                playerId: selectedPlayer.id, 
                job: job,
                grade: parseInt(grade)
            });
        }
    });
}

function setGang() {
    if (!selectedPlayer) return;
    showModal(t('set_gang', 'Set Gang'), modalTemplates.setGang(), () => {
        const gang = document.getElementById('gangName').value;
        const grade = document.getElementById('gangGrade').value;
        if (gang && grade !== null) {
            sendCommand('setGang', { 
                playerId: selectedPlayer.id, 
                gang: gang,
                grade: parseInt(grade)
            });
        }
    });
}

function openInventory() {
    if (!selectedPlayer) return;
    sendCommand('openInventory', { playerId: selectedPlayer.id });
}

function clearInventory() {
    if (!selectedPlayer) return;
    showModal('Clear Inventory', modalTemplates.confirm('Are you sure you want to clear this player\'s inventory? This action cannot be undone.'), () => {
        sendCommand('clearInventory', { playerId: selectedPlayer.id });
    });
}

function changePed() {
    if (!selectedPlayer) return;
    showModal(t('change_ped', 'Change Ped'), modalTemplates.changePed(), () => {
        const category = document.getElementById('pedCategory').value;
        const pedModel = document.getElementById('pedModel').value;
        const customPedCode = document.getElementById('customPedCode').value;
        
        let finalPedModel = '';
        
        if (customPedCode.trim()) {
            finalPedModel = customPedCode.trim();
        } else if (category && pedModel) {
            finalPedModel = pedModel;
        }
        
        if (finalPedModel) {
            sendCommand('changePed', { 
                playerId: selectedPlayer.id, 
                pedModel: finalPedModel
            });
        }
    });
}

function resetPed() {
    if (!selectedPlayer) return;
    showModal(t('reset_ped', 'Reset Ped'), modalTemplates.confirm('Are you sure you want to reset this player\'s ped to default?'), () => {
        sendCommand('resetPed', { playerId: selectedPlayer.id });
    });
}

function fixPlayerCar() {
    if (!selectedPlayer) return;
    sendCommand('fixPlayerCar', { playerId: selectedPlayer.id });
}

function giveClothingMenu() {
    if (!selectedPlayer) return;
    sendCommand('giveClothingMenu', { playerId: selectedPlayer.id });
}

function removePlayerCar() {
    if (!selectedPlayer) return;
    
    sendCommand('getPlayerVehicles', { playerId: selectedPlayer.id });
    
    showModal(t('remove_player_car', 'Remove Player Car'), modalTemplates.loading(), null);
}

function handlePlayerVehicles(vehicles) {
    if (!selectedPlayer) return;
    
    showModal(t('remove_player_car', 'Remove Player Car'), modalTemplates.removePlayerCar(vehicles), () => {
        const plateSelect = document.getElementById('carPlate');
        if (plateSelect && plateSelect.value) {
            sendCommand('removePlayerCar', { 
                playerId: selectedPlayer.id, 
                plate: plateSelect.value
            });
        }
    });
}

function spawnVehicle() {
    showModal('Spawn Vehicle', modalTemplates.spawnVehicle(), () => {
        const model = document.getElementById('vehicleModel').value;
        if (model) {
            sendCommand('spawnVehicle', { model: model });
        }
    });
}

function deleteVehicle() {
    sendCommand('deleteVehicle');
}

function repairVehicle() {
    sendCommand('repairVehicle');
}

function flipVehicle() {
    sendCommand('flipVehicle');
}

function maxTuneVehicle() {
    sendCommand('maxTuneVehicle');
}

function changeVehiclePlate() {
    showModal('Change License Plate', modalTemplates.changePlate(), () => {
        const plate = document.getElementById('plateText').value;
        if (plate) {
            sendCommand('changeVehiclePlate', { plate: plate.substring(0, 8) });
        }
    });
}

function spawnSelectedVehicle() {
    const model = document.getElementById('vehicleModelSelect').value;
    if (model) {
        sendCommand('spawnVehicle', { model: model });
    }
}

function setWeather(weather) {
    sendCommand('setWeather', { weather: weather });
}

function updateTimeDisplay() {
    const slider = document.getElementById('timeSlider');
    const display = document.getElementById('timeDisplay');
    display.textContent = `${slider.value}:00`;
}

function setTime() {
    const hour = document.getElementById('timeSlider').value;
    sendCommand('setTime', { hour: parseInt(hour) });
}

function setQuickTime(hour) {
    document.getElementById('timeSlider').value = hour;
    updateTimeDisplay();
    sendCommand('setTime', { hour: hour });
}

function toggleFreezeTime() {
    sendCommand('toggleFreezeTime');
}

function reviveAllPlayers() {
    showModal('Revive All Players', modalTemplates.confirm('Are you sure you want to revive all players on the server?'), () => {
        sendCommand('reviveAllPlayers');
    });
}

function giveItemAll() {
    showModal('Give Item to All Players', modalTemplates.giveItem(), () => {
        const item = document.getElementById('itemName').value;
        const amount = parseInt(document.getElementById('itemAmount').value) || 1;
        if (item) {
            sendCommand('giveItemAll', { item: item, amount: amount });
        }
    });
}

function giveMoneyAll() {
    showModal('Give Money to All Players', modalTemplates.giveMoney(), () => {
        const type = document.getElementById('moneyType').value;
        const amount = parseInt(document.getElementById('moneyAmount').value) || 0;
        if (amount > 0) {
            sendCommand('giveMoneyAll', { type: type, amount: amount });
        }
    });
}

function announceMessage() {
    showModal('Server Announcement', modalTemplates.announce(), () => {
        const message = document.getElementById('announceMessage').value;
        if (message) {
            sendCommand('announce', { message: message });
        }
    });
}

function clearArea() {
    showModal('Clear Area', modalTemplates.clearArea(), () => {
        const radius = document.getElementById('clearRadius').value;
        if (radius) {
            sendCommand('clearArea', { radius: parseInt(radius) });
        }
    });
}

function clearAllVehicles() {
    showModal('Clear All Vehicles', modalTemplates.confirm('Are you sure you want to clear all vehicles from the server?'), () => {
        sendCommand('clearAllVehicles');
    });
}

function refreshJobs() {
    sendCommand('refreshJobs');
}

function refreshItems() {
    sendCommand('refreshItems');
}

function teleportToWaypoint() {
    sendCommand('teleportToWaypoint');
}

function teleportToCoords() {
    showModal('Teleport to Coordinates', modalTemplates.teleportCoords(), () => {
        const coordsInput = document.getElementById('teleportCoords').value.trim();
        if (coordsInput) {
            let coords = [];
            
            const vectorMatch = coordsInput.match(/vector[34]\s*\(\s*([^)]+)\s*\)/i);
            if (vectorMatch) {
                coords = vectorMatch[1].split(',').map(coord => parseFloat(coord.trim()));
            } else {
                coords = coordsInput.split(',').map(coord => parseFloat(coord.trim()));
            }
            
            if (coords.length >= 3 && !isNaN(coords[0]) && !isNaN(coords[1]) && !isNaN(coords[2])) {
                sendCommand('teleportToCoords', { 
                    x: coords[0], 
                    y: coords[1], 
                    z: coords[2] 
                });
            } else {
                alert('Invalid coordinates format. Use: vector3(x,y,z), vector4(x,y,z,w), or x,y,z');
            }
        }
    });
}

function returnLastLocation() {
    sendCommand('returnLastLocation');
}

function teleportTo(location) {
    sendCommand('teleportToLocation', { location: location });
}
function toggleCoords() {
    sendCommand('toggleCoords');
}

function toggleNoclip() {
    sendCommand('toggleNoclip');
}

function toggleGodMode() {
    sendCommand('toggleGodMode');
}

function toggleInvisible() {
    sendCommand('toggleInvisible');
}

function toggleInfiniteAmmo() {
    sendCommand('toggleInfiniteAmmo');
}

function copyCoords() {
    showModal('Copy Coordinates', modalTemplates.coordsFormat(), null);
}

function copyCoordinates(format) {
    sendCommand('copyCoords', { format: format });
    document.getElementById('modal').style.display = 'none';
}

function copyHeading() {
    sendCommand('copyHeading');
}

function toggleEntityInfo() {
    sendCommand('toggleEntityInfo');
}

document.addEventListener('DOMContentLoaded', function() {
    const playerSearchElement = document.getElementById('playerSearch');
    if (playerSearchElement) {
        playerSearchElement.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const playerCards = document.querySelectorAll('.player-card');
            
            playerCards.forEach(card => {
                const badgeElement = card.querySelector('.player-card-badge');
                const nameElement = card.querySelector('.player-name');
                const fivemNameElement = card.querySelector('.player-fivem-name');
                
                if (!badgeElement || !nameElement || !fivemNameElement) return;
                
                const idMatch = badgeElement.textContent.match(/ID:\s*(\d+)/);
                const playerId = idMatch ? idMatch[1].toLowerCase() : '';
                
                const characterName = nameElement.textContent.toLowerCase();
                const fivemName = fivemNameElement.textContent.toLowerCase();
                
                const matchesId = playerId.includes(searchTerm);
                const matchesCharName = characterName.includes(searchTerm);
                const matchesFivemName = fivemName.includes(searchTerm);
                
                if (matchesId || matchesCharName || matchesFivemName) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});

window.addEventListener('load', function() {
    setTimeout(() => {
        populateVehicleCategories();
    }, 100);
});

function populateVehicleCategories() {
    const categorySelect = document.getElementById('vehicleCategory');
    if (!categorySelect) return;
    
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    for (const category in vehicleCategories) {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categorySelect.appendChild(option);
    }
}

function updateVehicleList() {
    const category = document.getElementById('vehicleCategory').value;
    const modelSelect = document.getElementById('vehicleModelSelect');
    modelSelect.innerHTML = '<option value="">Select Vehicle</option>';
    
    if (category && vehicleCategories[category]) {
        const vehicles = vehicleCategories[category];
        
        if (vehicles && vehicles.length > 0) {
            const sortedVehicles = [...vehicles].sort();
            
            sortedVehicles.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No vehicles available in this category';
            modelSelect.appendChild(option);
        }
    }
}

function updatePedOptions() {
    const category = document.getElementById('pedCategory').value;
    const pedSelect = document.getElementById('pedModel');
    
    pedSelect.innerHTML = '<option value="">Select Ped</option>';
    pedSelect.disabled = !category;
    
    if (!category) {
        pedSelect.innerHTML = '<option value="">Select category first...</option>';
        return;
    }
    
    // Use ped categories from server config instead of hardcoded data

    if (pedCategories[category]) {
        const peds = pedCategories[category].peds;
        
        if (peds.length > 0) {
            const sortedPeds = [...peds].sort();
            
            sortedPeds.forEach(ped => {
                const option = document.createElement('option');
                option.value = ped;
                option.textContent = ped;
                pedSelect.appendChild(option);
            });
        } else {
            pedSelect.innerHTML = '<option value="">No peds available in this category</option>';
        }
    }
}

function togglePlayerBlips() {
    fetch(`https://${resourceName}/togglePlayerBlips`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    }).then(resp => {
        if (resp.ok) {
            return resp.text();
        }
        throw new Error('Request failed');
    }).catch(err => {
        console.error('Failed to toggle player blips:', err);
    });
}

function togglePlayerNames() {
    fetch(`https://${resourceName}/togglePlayerNames`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    }).then(resp => {
        if (resp.ok) {
            return resp.text();
        }
        throw new Error('Request failed');
    }).catch(err => {
        console.error('Failed to toggle player names:', err);
    });
}
let selectedReportId = null;
let currentReports = {};
let selectedReportType = null;

window.addEventListener("message", function(event) {
    const data = event.data;
    
    if (data.action === "showReportForm") {
        showReportForm(data.reportTypes, data.players, data.maxLength);
    } else if (data.action === "closeReportForm") {
        closeReportForm();
    } else if (data.action === "updateReports") {
        updateReports(data.reports);
    } else if (data.action === "switchToReportsTab") {
        switchTab("reports");
    } else if (data.action === "reportMessageReceived") {
        handleReportMessageReceived(data);
    }
});

function showReportForm(reportTypes, players, maxLength) {
    const modal = document.getElementById("reportFormModal");
    const typeButtons = document.getElementById("reportTypeButtons");
    const playerSelect = document.getElementById("targetPlayerSelect");
    const messageInput = document.getElementById("reportMessageInput");
    const maxCharsSpan = document.getElementById("maxChars");
    
    typeButtons.innerHTML = "";
    playerSelect.innerHTML = "<option value=\"\">Select a player...</option>";
    document.getElementById("reportSubjectInput").value = "";
    messageInput.value = "";
    selectedReportType = null;
    
    messageInput.maxLength = maxLength;
    maxCharsSpan.textContent = maxLength;
    
    let firstType = null;
    Object.keys(reportTypes).forEach((typeKey, index) => {
        const type = reportTypes[typeKey];
        const button = document.createElement("div");
        button.className = "report-type-btn";
        button.setAttribute("data-type", typeKey);
        const translatedLabel = t(`report_types.${typeKey}`, type.label);
        button.innerHTML = `<i class="${type.icon}" style="color: ${type.color}"></i><span>${translatedLabel}</span>`;
        button.onclick = () => selectReportType(typeKey);
        typeButtons.appendChild(button);
        
        if (typeKey === 'bug' || (index === 0 && firstType === null)) {
            firstType = typeKey;
        }
    });
    
    if (firstType) {
        selectReportType(firstType);
    }
    
    players.forEach(player => {
        const option = document.createElement("option");
        option.value = player.id;
        option.textContent = `[${player.id}] ${player.name} | (${player.fivemName || 'Unknown'})`;
        playerSelect.appendChild(option);
    });
    
    modal.style.display = "flex";
    
    messageInput.addEventListener("input", updateCharCounter);
}

function selectReportType(type) {
    selectedReportType = type;
    
    document.querySelectorAll(".report-type-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    document.querySelector(`[data-type="${type}"]`).classList.add("active");
    
    const playerGroup = document.getElementById("targetPlayerGroup");
    if (type === "player") {
        playerGroup.style.display = "block";
    } else {
        playerGroup.style.display = "none";
        document.getElementById("targetPlayerSelect").value = "";
    }
}

function updateCharCounter() {
    const input = document.getElementById("reportMessageInput");
    const counter = document.getElementById("charCount");
    counter.textContent = input.value.length;
}

function submitReport() {
    const type = selectedReportType;
    const subject = document.getElementById("reportSubjectInput").value.trim();
    const message = document.getElementById("reportMessageInput").value.trim();
    const targetId = document.getElementById("targetPlayerSelect").value;
    
    if (!type) {
        alert("Please select a report type");
        return;
    }
    
    if (!subject) {
        alert("Please enter a subject");
        return;
    }
    
    if (!message) {
        alert("Please enter a description");
        return;
    }
    
    if (type === "player" && !targetId) {
        alert("Please select a player to report");
        return;
    }
    
    fetch(`https://${resourceName}/submitReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            type: type,
            subject: subject,
            message: message,
            targetId: targetId || null
        })
    });
    
    closeReportForm();
}

function closeReportForm() {
    const modal = document.getElementById("reportFormModal");
    modal.style.display = "none";
    
    fetch(`https://${resourceName}/closeReportForm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    });
}

function updateReports(reports) {
    currentReports = reports;
    
    claimInProgress = false;
    
    const reportsList = document.getElementById("reportsList");
    const reportCount = document.getElementById("reportCount");
    
    reportsList.innerHTML = "";
    
    const openReports = Object.values(reports).filter(r => r.status === "open").length;
    if (openReports > 0) {
        reportCount.textContent = openReports;
        reportCount.style.display = "inline-block";
    } else {
        reportCount.style.display = "none";
    }
    
    filterReports();
    
    if (selectedReportId && currentReports[selectedReportId]) {
        selectReport(selectedReportId);
    }
}

function filterReports() {
    const filter = document.getElementById("reportFilter").value;
    const reportsList = document.getElementById("reportsList");
    
    reportsList.innerHTML = "";
    
    Object.values(currentReports).forEach(report => {
        if (filter === "all" || report.status === filter) {
            const reportItem = createReportItem(report);
            reportsList.appendChild(reportItem);
        }
    });
}

function createReportItem(report) {
    const item = document.createElement("div");
    item.className = "report-item";
    item.onclick = () => selectReport(report.id);
    
    const reportTypes = {
        'player': { label: t('report_types.player', 'Player Report'), icon: 'fas fa-user-shield', color: '#e74c3c' },
        'bug': { label: t('report_types.bug', 'Bug Report'), icon: 'fas fa-bug', color: '#f39c12' },
        'question': { label: t('report_types.question', 'Question'), icon: 'fas fa-question-circle', color: '#3498db' }
    };
    
    const typeConfig = reportTypes[report.type] || {
        label: t(`report_types.${report.type}`, report.type),
        icon: "fas fa-flag",
        color: "#666"
    };
    
    const createdDate = new Date(report.createdAt * 1000).toLocaleDateString();
    
    item.innerHTML = `
        <div class="report-item-header">
            <div class="report-item-type" style="color: ${typeConfig.color}">
                <i class="${typeConfig.icon}"></i>
                ${typeConfig.label}
            </div>
            <span class="report-item-status ${report.status}">${report.status.toUpperCase()}</span>
        </div>
        <div class="report-item-subject">${report.subject}</div>
        <div class="report-item-meta">
            ${report.reporterName} • ${createdDate} • ID: ${report.id}
        </div>
    `;
    
    return item;
}

function selectReport(reportId) {
    selectedReportId = reportId;
    const report = currentReports[reportId];
    
    document.querySelectorAll(".report-item").forEach(item => {
        item.classList.remove("active");
    });
    document.querySelector(`[onclick="selectReport(\\"${reportId}\\")"]`)?.classList.add("active");
    
    const details = document.getElementById("reportDetails");
    details.style.display = "block";
    
    const reportTypes = {
        'player': { label: 'Player Report', icon: 'fas fa-user-shield', color: '#e74c3c' },
        'bug': { label: 'Bug Report', icon: 'fas fa-bug', color: '#f39c12' },
        'question': { label: 'Question', icon: 'fas fa-question-circle', color: '#3498db' }
    };
    
    const typeConfig = reportTypes[report.type] || {
        label: report.type,
        icon: "fas fa-flag"
    };
    
    document.getElementById("reportType").textContent = typeConfig.label;
    document.getElementById("reportSubject").textContent = report.subject;
    document.getElementById("reportId").textContent = report.id;
    document.getElementById("reportStatus").textContent = report.status.toUpperCase();
    document.getElementById("reportStatus").className = `report-status ${report.status}`;
    document.getElementById("reporterName").textContent = report.reporterName;
    document.getElementById("reportCreated").textContent = new Date(report.createdAt * 1000).toLocaleString();
    
    const reportedPlayerRow = document.getElementById("reportedPlayerRow");
    if (report.targetId && report.targetName) {
        reportedPlayerRow.style.display = "block";
        document.getElementById("reportedPlayerName").textContent = `${report.targetName} (ID: ${report.targetId})`;
    } else {
        reportedPlayerRow.style.display = "none";
    }
    
    const claimedByRow = document.getElementById("claimedByRow");
    if (report.claimedBy) {
        claimedByRow.style.display = "block";
        document.getElementById("claimedByName").textContent = report.claimedByName;
    } else {
        claimedByRow.style.display = "none";
    }
    
    const claimBtn = document.getElementById("claimBtn");
    if (report.status === "open") {
        claimBtn.textContent = "🤚 " + t('claim_report', 'Claim');
        claimBtn.style.display = "inline-block";
        claimBtn.disabled = false;
        claimBtn.classList.remove('disabled');
        claimBtn.onclick = () => claimReport();
    } else if (report.claimedBy && report.status === "claimed") {
        claimBtn.textContent = "✋ " + t('claimed', 'Claimed');
        claimBtn.style.display = "inline-block";
        claimBtn.disabled = true;
        claimBtn.classList.add('disabled');
        claimBtn.onclick = null;
    } else {
        claimBtn.style.display = "none";
    }
    
    loadReportMessages(report);
}

function loadReportMessages(report) {
    const messagesContainer = document.getElementById("reportMessages");
    messagesContainer.innerHTML = "";
    
    report.messages.forEach(msg => {
        const messageDiv = document.createElement("div");
        messageDiv.className = `chat-message ${msg.sender}`;
        
        const timestamp = new Date(msg.timestamp * 1000).toLocaleString();
        messageDiv.innerHTML = `
            <div class="message-header">${msg.senderName} • ${timestamp}</div>
            <div class="message-content">${msg.message}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
    });
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function updateReportUI(report) {
    const statusElement = document.getElementById("reportStatus");
    if (statusElement) {
        statusElement.textContent = report.status.toUpperCase();
        statusElement.className = `report-status ${report.status}`;
    }
    
    const claimBtn = document.getElementById("claimBtn");
    if (claimBtn) {
        if (report.status === "claimed") {
            claimBtn.textContent = "✋ " + t('claimed', 'Claimed');
            claimBtn.disabled = true;
            claimBtn.classList.add('disabled');
            claimBtn.onclick = null;
        } else if (report.status === "open") {
            claimBtn.textContent = "🤚 " + t('claim_report', 'Claim');
            claimBtn.disabled = false;
            claimBtn.classList.remove('disabled');
            claimBtn.onclick = () => claimReport();
        }
    }
    
    const reportItems = document.querySelectorAll(".report-item");
    reportItems.forEach(item => {
        if (item.onclick && item.onclick.toString().includes(report.id)) {
            const statusSpan = item.querySelector(".report-item-status");
            if (statusSpan) {
                statusSpan.textContent = report.status.toUpperCase();
                statusSpan.className = `report-item-status ${report.status}`;
            }
        }
    });
}

function claimReport() {
    if (!selectedReportId || claimInProgress) return;
    
    claimInProgress = true;
    
    const claimBtn = document.getElementById("claimBtn");
    if (claimBtn) {
        claimBtn.disabled = true;
        claimBtn.classList.add('disabled');
    }
    
    const report = currentReports[selectedReportId];
    if (report && report.status === "open") {
        report.status = "claimed";
        report.claimedBy = "pending"; // Temporary value
        
        updateReportUI(report);
    }
    
    fetch(`https://${resourceName}/claimReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: selectedReportId })
    }).then(() => {
        claimInProgress = false;
    }).catch(error => {
        console.error("Failed to claim report:", error);
        claimInProgress = false;
        if (claimBtn) {
            claimBtn.disabled = false;
            claimBtn.classList.remove('disabled');
        }
        if (report) {
            report.status = "open";
            report.claimedBy = null;
            updateReportUI(report);
        }
    });
}

function sendReportReply() {
    const input = document.getElementById("reportReply");
    const message = input.value.trim();
    
    if (!message || !selectedReportId) return;
    
    fetch(`https://${resourceName}/sendReportMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            reportId: selectedReportId,
            message: message
        })
    });
    
    input.value = "";
}

function handleReportReply(event) {
    if (event.key === "Enter") {
        sendReportReply();
    }
}

function gotoReporter() {
    if (!selectedReportId) return;
    
    const report = currentReports[selectedReportId];
    if (!report || !report.reporterId) return;
    
    fetch(`https://${resourceName}/reportGotoPlayer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reporterId: report.reporterId })
    });
}

function bringReporter() {
    if (!selectedReportId) return;
    
    const report = currentReports[selectedReportId];
    if (!report || !report.reporterId) return;
    
    fetch(`https://${resourceName}/reportBringPlayer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reporterId: report.reporterId })
    });
}

function sendReporterBack() {
    if (!selectedReportId) return;
    
    const report = currentReports[selectedReportId];
    if (!report || !report.reporterId) return;
    
    fetch(`https://${resourceName}/reportSendPlayerBack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reporterId: report.reporterId })
    });
}

function healReporter() {
    if (!selectedReportId) return;
    
    const report = currentReports[selectedReportId];
    if (!report || !report.reporterId) return;
    
    fetch(`https://${resourceName}/reportHealPlayer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reporterId: report.reporterId })
    });
}

function freezeReporter() {
    if (!selectedReportId) return;
    
    const report = currentReports[selectedReportId];
    if (!report || !report.reporterId) return;
    
    fetch(`https://${resourceName}/reportFreezePlayer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reporterId: report.reporterId })
    });
}

function closeReport() {
    if (!selectedReportId) return;
    
    showModal('Close Report', modalTemplates.closeReport(), () => {
        const reason = document.getElementById('closeReason').value.trim();
        
        fetch(`https://${resourceName}/closeReport`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                reportId: selectedReportId,
                reason: reason || "Resolved"
            })
        }).then(() => {
            setTimeout(() => {
                fetch(`https://${resourceName}/getReports`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({})
                });
            }, 500);
        });
    });
}

function deleteReport() {
    if (!selectedReportId) return;
    
    showModal('Delete Report', modalTemplates.confirm('Are you sure you want to delete this report? This action cannot be undone.'), () => {
        fetch(`https://${resourceName}/deleteReport`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reportId: selectedReportId })
        });
        
        document.getElementById("reportDetails").style.display = "none";
        selectedReportId = null;
    });
}

function handleReportMessageReceived() {
}

function switchTab(tabName) {
    if (tabName !== 'players') {
        closePlayerOptions();
    }
    
    document.querySelectorAll(".menu-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    
    const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
    const targetContent = document.getElementById(tabName);
    
    if (targetTab && targetContent) {
        targetTab.classList.add("active");
        targetContent.classList.add("active");
        
        if (tabName === "reports") {
            fetch(`https://${resourceName}/getReports`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            });
        }
    }
}

let warningTimer = null;
let warningInterval = null;

function showWarning(message) {
    const warningHTML = `
        <div class="warning-modal" id="warningModal">
            <div class="warning-content">
                <div class="warning-icon">⚠️</div>
                <h2 class="warning-title">WARNING</h2>
                <div class="warning-message">${message}</div>
                <div class="warning-dismiss">
                    <p class="warning-instruction">Press and hold SPACE for 3 seconds to dismiss</p>
                    <div class="warning-progress" id="warningProgress">
                        <div class="warning-progress-bar" id="warningProgressBar"></div>
                    </div>
                    <button class="warning-button" onclick="dismissWarning()">I Understand</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', warningHTML);
    
    let spaceHeldTime = 0;
    let isHoldingSpace = false;
    
    const handleKeyDown = (e) => {
        if (e.code === 'Space' && !isHoldingSpace) {
            e.preventDefault();
            isHoldingSpace = true;
            document.getElementById('warningProgress').classList.add('active');
            
            warningInterval = setInterval(() => {
                spaceHeldTime += 0.1;
                const progress = Math.min((spaceHeldTime / 3) * 100, 100);
                document.getElementById('warningProgressBar').style.width = progress + '%';
                
                if (spaceHeldTime >= 3) {
                    dismissWarning();
                }
            }, 100);
        }
    };
    
    const handleKeyUp = (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            isHoldingSpace = false;
            spaceHeldTime = 0;
            document.getElementById('warningProgress').classList.remove('active');
            document.getElementById('warningProgressBar').style.width = '0%';
            
            if (warningInterval) {
                clearInterval(warningInterval);
                warningInterval = null;
            }
        }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    window.warningKeyHandlers = { handleKeyDown, handleKeyUp };
}

function dismissWarning() {
    const modal = document.getElementById('warningModal');
    if (modal) {
        modal.remove();
    }
    
    if (window.warningKeyHandlers) {
        document.removeEventListener('keydown', window.warningKeyHandlers.handleKeyDown);
        document.removeEventListener('keyup', window.warningKeyHandlers.handleKeyUp);
        delete window.warningKeyHandlers;
    }
    
    if (warningInterval) {
        clearInterval(warningInterval);
        warningInterval = null;
    }
    
    fetch(`https://${resourceName}/dismissWarning`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    });
}

let adminChatMessages = [];
let unreadMessages = 0;
let currentTab = 'players';

function initializeAdminChat() {
    if (permissions.adminChat) {
        document.getElementById('adminChatTab').style.display = 'block';
        fetchAdminChatHistory();
    }
}

function fetchAdminChatHistory() {
    fetch(`https://${resourceName}/getAdminChatHistory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
    });
}

function handleAdminChatInput(event) {
    if (event.key === 'Enter') {
        sendAdminChatMessage();
    }
}

function sendAdminChatMessage() {
    const input = document.getElementById('adminChatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    fetch(`https://${resourceName}/sendAdminChatMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })
    });
    
    input.value = '';
}

function clearAdminChat() {
    if (!permissionLevel || !permissions.adminChat) {
        return;
    }
    
    showModal(t('clear_chat', 'Clear Admin Chat'), modalTemplates.confirm(t('confirm_clear_chat', 'Are you sure you want to clear all admin chat messages?')), () => {
        fetch(`https://${resourceName}/clearAdminChat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });
    });
}

function formatChatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function renderAdminChatMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `admin-chat-message${message.isSystem ? ' system' : ''}`;
    
    const headerDiv = document.createElement('div');
    headerDiv.className = 'admin-chat-header';
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'admin-chat-name';
    nameSpan.textContent = message.name;
    
    const rightDiv = document.createElement('div');
    rightDiv.style.display = 'flex';
    rightDiv.style.alignItems = 'center';
    rightDiv.style.gap = '10px';
    
    if (message.permissionLevel && !message.isSystem) {
        const permSpan = document.createElement('span');
        permSpan.className = `admin-chat-permission ${message.permissionLevel}`;
        permSpan.textContent = message.permissionLevel.toUpperCase();
        rightDiv.appendChild(permSpan);
    }
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'admin-chat-time';
    timeSpan.textContent = formatChatTime(message.timestamp);
    rightDiv.appendChild(timeSpan);
    
    headerDiv.appendChild(nameSpan);
    headerDiv.appendChild(rightDiv);
    
    const textDiv = document.createElement('div');
    textDiv.className = 'admin-chat-text';
    textDiv.textContent = message.message;
    
    messageDiv.appendChild(headerDiv);
    messageDiv.appendChild(textDiv);
    
    return messageDiv;
}

function loadAdminChatMessages(messages) {
    const container = document.getElementById('adminChatMessages');
    container.innerHTML = '';
    
    adminChatMessages = messages;
    
    messages.forEach(message => {
        container.appendChild(renderAdminChatMessage(message));
    });
    
    container.scrollTop = container.scrollHeight;
}

function receiveAdminChatMessage(message) {
    adminChatMessages.push(message);
    
    const container = document.getElementById('adminChatMessages');
    container.appendChild(renderAdminChatMessage(message));
    container.scrollTop = container.scrollHeight;
    
    if (currentTab !== 'adminchat') {
        unreadMessages++;
        updateUnreadBadge();
    }
}

function updateVehicleTranslations() {
    const section = document.getElementById('vehicle');
    if (section) {
        section.querySelector('h2').textContent = t('vehicle_options', 'Vehicle Options');
        const buttons = [
            { text: 'spawn_vehicle', icon: 'fa-plus' },
            { text: 'delete_vehicle', icon: 'fa-trash' },
            { text: 'repair_vehicle', icon: 'fa-wrench' },
            { text: 'flip_vehicle', icon: 'fa-undo' },
            { text: 'max_tune', icon: 'fa-tachometer-alt' },
            { text: 'change_plate', icon: 'fa-id-card' }
        ];
        const vehicleButtons = section.querySelectorAll('.option-btn');
        vehicleButtons.forEach((btn, index) => {
            if (buttons[index]) {
                btn.innerHTML = `<i class="fas ${buttons[index].icon}"></i> ${t(buttons[index].text, buttons[index].text.replace(/_/g, ' '))}`;
            }
        });
        
        const spawnerTitle = section.querySelector('.vehicle-spawner h3');
        if (spawnerTitle) spawnerTitle.textContent = t('vehicle_spawner', 'Vehicle Spawner');
        
        const categorySelect = section.querySelector('#vehicleCategory');
        if (categorySelect && categorySelect.options[0]) {
            categorySelect.options[0].textContent = t('select_category', 'Select Category');
        }
        
        const modelSelect = section.querySelector('#vehicleModelSelect');
        if (modelSelect && modelSelect.options[0]) {
            modelSelect.options[0].textContent = t('select_vehicle', 'Select Vehicle');
        }
        
        const spawnBtn = section.querySelector('[onclick*="spawnSelectedVehicle"]');
        if (spawnBtn) spawnBtn.textContent = t('spawn_vehicle', 'Spawn Vehicle');
    }
}

function updateWorldTranslations() {
    const section = document.getElementById('world');
    if (section) {
        section.querySelector('h2').textContent = t('weather_time', 'Weather & Time');
        
        const headers = section.querySelectorAll('h3');
        if (headers[0]) headers[0].textContent = t('weather_control', 'Weather Control');
        if (headers[1]) headers[1].textContent = t('time_control', 'Time Control');
        
        const weatherButtons = [
            { weather: 'CLEAR', key: 'clear' },
            { weather: 'RAIN', key: 'rain' },
            { weather: 'THUNDER', key: 'thunder' },
            { weather: 'SNOWLIGHT', key: 'snowlight' },
            { weather: 'FOGGY', key: 'foggy' },
            { weather: 'OVERCAST', key: 'overcast' }
        ];
        
        weatherButtons.forEach(btn => {
            const element = section.querySelector(`[onclick*="setWeather('${btn.weather}')"]`);
            if (element) {
                const icon = element.querySelector('i');
                const iconClass = icon ? icon.className : '';
                element.innerHTML = `<i class="${iconClass}"></i> ${t(`weather_types.${btn.key.toLowerCase()}`, btn.key)}`;
            }
        });
        
        const freezeTimeBtn = section.querySelector('[onclick*="toggleFreezeTime"]');
        if (freezeTimeBtn) {
            const icon = freezeTimeBtn.querySelector('i');
            const iconClass = icon ? icon.className : '';
            freezeTimeBtn.innerHTML = `<i class="${iconClass}"></i> ${t('freeze_time', 'Freeze Time')}`;
        }
        
        const setTimeBtn = section.querySelector('[onclick*="setTime"]');
        if (setTimeBtn) {
            setTimeBtn.textContent = t('set_time', 'Set Time');
        }
        
        const timeButtons = [
            { time: 6, text: 'morning' },
            { time: 12, text: 'noon' },
            { time: 18, text: 'evening' },
            { time: 0, text: 'midnight' }
        ];
        
        timeButtons.forEach(btn => {
            const element = section.querySelector(`[onclick*="setQuickTime(${btn.time})"]`);
            if (element) {
                element.textContent = t(`time_${btn.text}`, btn.text.charAt(0).toUpperCase() + btn.text.slice(1));
            }
        });
    }
}

function updateServerTranslations() {
    const section = document.getElementById('server');
    if (section) {
        section.querySelector('h2').textContent = t('server_management', 'Server Management');
        
        const serverButtons = [
            { selector: 'reviveAllPlayers', key: 'revive_all' },
            { selector: 'announceMessage', key: 'announcement' },
            { selector: 'clearArea', key: 'clear_area' },
            { selector: 'clearAllVehicles', key: 'clear_all_vehicles' },
            { selector: 'refreshJobs', key: 'refresh_jobs' },
            { selector: 'refreshItems', key: 'refresh_items' }
        ];
        
        serverButtons.forEach(btn => {
            const element = section.querySelector(`[onclick*="${btn.selector}"]`);
            if (element) {
                const icon = element.querySelector('i');
                const iconClass = icon ? icon.className : '';
                element.innerHTML = `<i class="${iconClass}"></i> ${t(btn.key, btn.key.replace(/_/g, ' '))}`;
            }
        });
        
        const infoTitle = section.querySelector('.server-info h3');
        if (infoTitle) infoTitle.textContent = t('server_information', 'Server Information');
        
        const infoLabels = section.querySelectorAll('.info-label');
        const labelKeys = ['players_online', 'max_players', 'server_uptime'];
        infoLabels.forEach((label, index) => {
            if (labelKeys[index]) {
                label.textContent = t(labelKeys[index], label.textContent) + ':';
            }
        });
    }
}

function updateTeleportTranslations() {
    const section = document.getElementById('teleport');
    if (section) {
        section.querySelector('h2').textContent = t('teleport_options', 'Teleport Options');
        const buttons = [
            { selector: 'teleportToWaypoint', key: 'to_waypoint' },
            { selector: 'teleportToCoords', key: 'to_coordinates' },
            { selector: 'returnLastLocation', key: 'return_last' }
        ];
        buttons.forEach(btn => {
            const element = section.querySelector(`[onclick*="${btn.selector}"]`);
            if (element) {
                const icon = element.querySelector('i');
                element.innerHTML = `<i class="${icon ? icon.className : 'fas fa-map-marker'}"></i> ${t(btn.key, btn.key.replace(/_/g, ' '))}`;
            }
        });
        
        const quickTitle = section.querySelector('.teleport-section h3');
        if (quickTitle) quickTitle.textContent = t('quick_locations', 'Quick Locations');
    }
}

function updateTeleportLocations() {
    const locationGrid = document.querySelector('.location-grid');
    if (!locationGrid) return;
    
    locationGrid.innerHTML = '';
    
    for (const [key, location] of Object.entries(teleportLocations)) {
        const button = document.createElement('button');
        button.className = 'location-btn';
        button.onclick = () => teleportTo(key);
        button.textContent = location.label || key;
        locationGrid.appendChild(button);
    }
}

function updateDeveloperTranslations() {
    const section = document.getElementById('developer');
    if (section) {
        section.querySelector('h2').textContent = t('developer_options', 'Developer Options');
        
        const devButtons = [
            { selector: 'toggleCoords', key: 'show_coords', text: 'Toggle Coords' },
            { selector: 'toggleNoclip', key: 'noclip', text: 'NoClip' },
            { selector: 'toggleGodMode', key: 'godmode', text: 'God Mode' },
            { selector: 'toggleInvisible', key: 'invisible', text: 'Invisible' },
            { selector: 'toggleInfiniteAmmo', key: 'infinite_ammo', text: 'Infinite Ammo' },
            { selector: 'copyCoords', key: 'copy_coords', text: 'Copy Coords' },
            { selector: 'copyHeading', key: 'copy_heading', text: 'Copy Heading' },
            { selector: 'toggleEntityInfo', key: 'entity_info', text: 'Entity Info' },
            { selector: 'togglePlayerBlips', key: 'player_blips', text: 'Player Blips' },
            { selector: 'togglePlayerNames', key: 'player_names', text: 'Player Names' }
        ];
        
        devButtons.forEach(btn => {
            const element = section.querySelector(`[onclick*="${btn.selector}"]`);
            if (element) {
                const icon = element.querySelector('i');
                const iconClass = icon ? icon.className : '';
                if (btn.selector === 'toggleNoclip') {
                    element.innerHTML = `<i class="${iconClass}"></i> ${t(btn.key, btn.text)} <span style="font-size: 11px; opacity: 0.7;">(F2)</span>`;
                } else {
                    element.innerHTML = `<i class="${iconClass}"></i> ${t(btn.key, btn.text)}`;
                }
            }
        });
    }
}

function updateReportsTranslations() {
    const section = document.getElementById('reports');
    if (section) {
        section.querySelector('h2').textContent = t('report_management', 'Report Management');
        
        const filterSelect = document.getElementById('reportFilter');
        if (filterSelect) {
            const options = filterSelect.querySelectorAll('option');
            const filterKeys = ['all_reports', 'open', 'claimed', 'closed'];
            options.forEach((option, index) => {
                if (filterKeys[index]) {
                    option.textContent = t(filterKeys[index], option.textContent);
                }
            });
        }
        
        const reportActionButtons = [
            { selector: 'claimBtn', key: 'claim_report' },
            { selector: 'gotoReporter', key: 'go_to_player' },
            { selector: 'bringReporter', key: 'bring_player' },
            { selector: 'sendReporterBack', key: 'send_back' },
            { selector: 'healReporter', key: 'heal' },
            { selector: 'freezeReporter', key: 'freeze' },
            { selector: 'closeReport', key: 'close' },
            { selector: 'deleteReport', key: 'delete_report' }
        ];
        
        reportActionButtons.forEach(btn => {
            const element = document.querySelector(`[onclick*="${btn.selector}"]`);
            if (element) {
                const icon = element.querySelector('i');
                if (icon) {
                    const iconClass = icon.className;
                    element.innerHTML = `<i class="${iconClass}"></i> ${t(btn.key, btn.key.replace(/_/g, ' '))}`;
                }
            }
        });
    }
}

function updateAdminChatTranslations() {
    const section = document.getElementById('adminchat');
    if (section) {
        section.querySelector('h2').textContent = t('admin_chat_title', 'Admin Chat');
        const input = section.querySelector('#adminChatInput');
        if (input) {
            input.placeholder = t('type_message', 'Type your message...');
        }
        const clearBtn = section.querySelector('.admin-chat-clear');
        if (clearBtn) {
            clearBtn.title = t('clear_chat', 'Clear chat') + ' (Admin only)';
        }
    }
}

const modalTemplates = {
    kickPlayer: () => `
        <label class="modal-label">${t('enter_reason', 'Kick Reason')}</label>
        <input type="text" class="modal-input" id="kickReason" placeholder="${t('enter_reason', 'Enter reason for kick...')}">
    `,
    
    warnPlayer: () => `
        <label class="modal-label">${t('warning_title', 'Warning Message')}</label>
        <textarea class="modal-textarea" id="warnMessage" placeholder="${t('enter_reason', 'Enter warning message...')}" style="height: 100px;"></textarea>
    `,
    
    banPlayer: () => `
        <label class="modal-label">${t('enter_reason', 'Ban Reason')}</label>
        <input type="text" class="modal-input" id="banReason" placeholder="${t('enter_reason', 'Enter reason for ban...')}">
        <label class="modal-label">${t('ban_duration', 'Ban Duration (hours, 0 for permanent)')}</label>
        <input type="number" class="modal-input" id="banDuration" placeholder="0" min="0">
    `,
    
    giveItem: () => `
        <label class="modal-label">${t('enter_item_name', 'Item Name')}</label>
        <input type="text" class="modal-input" id="itemName" placeholder="e.g., water_bottle, weapon_pistol">
        <label class="modal-label">${t('enter_amount', 'Amount')}</label>
        <input type="number" class="modal-input" id="itemAmount" placeholder="1" min="1" value="1">
    `,
    
    giveMoney: () => `
        <label class="modal-label">${t('enter_money_type', 'Money Type')}</label>
        <select class="modal-select" id="moneyType">
            <option value="cash">${t('cash', 'Cash')}</option>
            <option value="bank">${t('bank', 'Bank')}</option>
        </select>
        <label class="modal-label">${t('enter_amount', 'Amount')}</label>
        <input type="number" class="modal-input" id="moneyAmount" placeholder="100" min="1">
    `,
    
    giveCar: () => {
        let garageOptions = '';
        if (vehicleSettings.garages) {
            // Group garages by type
            const publicGarages = [];
            const depotGarages = [];
            const jobGarages = [];
            const gangGarages = [];
            
            for (const garageId in vehicleSettings.garages) {
                const garage = vehicleSettings.garages[garageId];
                // Only include car garages
                if (garage.category === 'car') {
                    const option = { id: garageId, label: garage.label, type: garage.type };
                    
                    switch (garage.type) {
                        case 'public':
                            publicGarages.push(option);
                            break;
                        case 'depot':
                            depotGarages.push(option);
                            break;
                        case 'job':
                            jobGarages.push(option);
                            break;
                        case 'gang':
                            gangGarages.push(option);
                            break;
                    }
                }
            }
            
            // Add public garages
            if (publicGarages.length > 0) {
                garageOptions += `<optgroup label="${t('public_garages', 'Public Garages')}">`;
                publicGarages.forEach(garage => {
                    garageOptions += `<option value="${garage.id}">${t(`garage_${garage.id}`, garage.label)}</option>`;
                });
                garageOptions += '</optgroup>';
            }
            
            // Add depot garages
            if (depotGarages.length > 0) {
                garageOptions += `<optgroup label="${t('depot_garages', 'Depot Garages')}">`;
                depotGarages.forEach(garage => {
                    garageOptions += `<option value="${garage.id}">${t(`garage_${garage.id}`, garage.label)}</option>`;
                });
                garageOptions += '</optgroup>';
            }
            
            // Add job garages
            if (jobGarages.length > 0) {
                garageOptions += `<optgroup label="${t('job_garages', 'Job Garages')}">`;
                jobGarages.forEach(garage => {
                    garageOptions += `<option value="${garage.id}">${t(`garage_${garage.id}`, garage.label)}</option>`;
                });
                garageOptions += '</optgroup>';
            }
            
            // Add gang garages
            if (gangGarages.length > 0) {
                garageOptions += `<optgroup label="${t('gang_garages', 'Gang Garages')}">`;
                gangGarages.forEach(garage => {
                    garageOptions += `<option value="${garage.id}">${t(`garage_${garage.id}`, garage.label)}</option>`;
                });
                garageOptions += '</optgroup>';
            }
        } else {
            // Fallback to common garages if settings not loaded yet
            garageOptions = `
                <option value="pillboxgarage">${t('garage_pillbox', 'Pillbox Garage Parking')}</option>
                <option value="motelgarage">${t('garage_motel', 'Motel Parking')}</option>
                <option value="spanishave">${t('garage_spanish', 'Spanish Ave Parking')}</option>
                <option value="sapcounsel">${t('garage_sapcounsel', 'San Andreas Parking')}</option>
                <option value="caears24">${t('garage_caears24', 'Caears 24 Parking')}</option>
                <option value="beachp">${t('garage_beach', 'Beach Parking')}</option>
            `;
        }
        return `
            <label class="modal-label">${t('enter_vehicle_model', 'Vehicle Model')}</label>
            <input type="text" class="modal-input" id="carModel" placeholder="e.g., adder, zentorno, police">
            <label class="modal-label">${t('select_garage', 'Select Garage')}</label>
            <select class="modal-select" id="garageType">
                ${garageOptions}
            </select>
            <label class="modal-label">${t('license_plate', 'License Plate')}</label>
            <select class="modal-select" id="plateType" onchange="toggleCustomPlate()">
                <option value="random">${t('random_plate', 'Random Plate')}</option>
                <option value="custom">${t('custom_plate', 'Custom Plate')}</option>
            </select>
            <input type="text" class="modal-input" id="customPlate" placeholder="${t('enter_custom_plate', 'Enter custom plate (max 8 characters)')}" maxlength="8" style="display: none; margin-top: 10px;">
            <p style="color: #64748b; font-size: 12px; margin-top: 5px;">${t('vehicle_garage_note', 'Enter the spawn name of the vehicle. The car will be added to the selected garage.')}</p>
        `;
    },
    
    setJob: () => `
        <label class="modal-label">${t('enter_job_name', 'Job Name')}</label>
        <input type="text" class="modal-input" id="jobName" placeholder="e.g., police, ambulance, mechanic">
        <label class="modal-label">${t('enter_job_grade', 'Grade')}</label>
        <input type="number" class="modal-input" id="jobGrade" placeholder="0" min="0" value="0">
    `,
    
    setGang: () => `
        <label class="modal-label">${t('enter_gang_name', 'Gang Name')}</label>
        <input type="text" class="modal-input" id="gangName" placeholder="e.g., ballas, vagos, families">
        <label class="modal-label">${t('enter_gang_grade', 'Gang Grade')}</label>
        <input type="number" class="modal-input" id="gangGrade" placeholder="0" min="0" value="0">
    `,
    
    spawnVehicle: () => `
        <label class="modal-label">${t('enter_vehicle_model', 'Vehicle Model')}</label>
        <input type="text" class="modal-input" id="vehicleModel" placeholder="e.g., adder, zentorno, police">
    `,
    
    changePlate: () => `
        <label class="modal-label">${t('enter_license_plate', 'New License Plate')} (max 8)</label>
        <input type="text" class="modal-input" id="plateText" placeholder="ABC 123" maxlength="8">
    `,
    
    removePlayerCar: (vehicles = []) => {
        if (vehicles.length === 0) {
            return `
                <p style="color: #e74c3c; text-align: center; margin: 20px 0;">${t('no_vehicles_found', 'No vehicles found for this player')}</p>
            `;
        }
        
        let options = vehicles.map(vehicle => {
            const stateText = vehicle.state === 0 ? t('in_garage', 'In Garage') : t('out_of_garage', 'Out');
            const garageText = vehicle.garage ? ` - ${vehicle.garage}` : '';
            return `<option value="${vehicle.plate}">${vehicle.plate} - ${vehicle.name}${garageText} (${stateText})</option>`;
        }).join('');
        
        return `
            <label class="modal-label">${t('select_vehicle', 'Select Vehicle to Remove')}</label>
            <select class="modal-input" id="carPlate" style="width: 100%; padding: 8px; background: #1e293b; border: 1px solid #334155; border-radius: 4px; color: #e2e8f0;">
                <option value="">${t('select_vehicle_placeholder', 'Choose a vehicle...')}</option>
                ${options}
            </select>
            <p style="color: #64748b; font-size: 12px; margin-top: 5px;">${t('remove_car_note_dropdown', 'Select the vehicle to remove from the player\'s garage')}</p>
        `;
    },
    
    loading: () => `
        <div style="text-align: center; padding: 20px;">
            <div style="display: inline-block; width: 40px; height: 40px; border: 3px solid #334155; border-radius: 50%; border-top-color: #3b82f6; animation: spin 1s linear infinite;"></div>
            <p style="color: #94a3b8; margin-top: 10px;">${t('loading', 'Loading...')}</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `,
    
    teleportCoords: () => `
        <label class="modal-label">${t('enter_coordinates', 'Enter Coordinates')}</label>
        <input type="text" class="modal-input" id="teleportCoords" placeholder="vector3(195.17, -933.77, 30.69) or 195.17, -933.77, 30.69">
        <p style="color: #64748b; font-size: 12px; margin-top: 5px;">Formats: vector3(x, y, z) or vector4(x, y, z, w) or x, y, z</p>
    `,
    
    prompt: (placeholder = '') => `
        <input type="text" class="modal-input" id="modalPromptInput" placeholder="${placeholder}">
    `,
    
    confirm: (message) => `
        <p style="color: #e2e8f0; font-size: 14px; margin: 0;">${message}</p>
    `,
    
    announce: () => `
        <label class="modal-label">${t('enter_announcement', 'Announcement Message')}</label>
        <textarea class="modal-textarea" id="announceMessage" placeholder="${t('enter_announcement', 'Enter your server-wide announcement...')}"></textarea>
    `,
    
    announcement: () => `
        <label class="modal-label">${t('enter_announcement', 'Announcement Message')}</label>
        <textarea class="modal-textarea" id="announcementText" placeholder="${t('enter_announcement', 'Enter your announcement...')}" style="height: 100px;"></textarea>
    `,
    
    clearArea: () => `
        <label class="modal-label">Radius (meters)</label>
        <input type="number" class="modal-input" id="clearRadius" placeholder="50" min="1" value="50">
    `,
    
    coordsFormat: () => `
        <label class="modal-label">Choose Coordinate Format</label>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button class="action-btn" style="flex: 1;" onclick="copyCoordinates('vector3')">Vector3</button>
            <button class="action-btn" style="flex: 1;" onclick="copyCoordinates('vector4')">Vector4</button>
        </div>
    `,
    
    closeReport: () => `
        <label class="modal-label">Close Reason (Optional)</label>
        <textarea class="modal-textarea" id="closeReason" placeholder="Enter reason for closing this report..." rows="3"></textarea>
        <p style="color: #64748b; font-size: 12px; margin-top: 5px;">This will mark the report as resolved and notify the reporter.</p>
    `,
    
    offlineBan: () => `
        <label class="modal-label">Player Identifier</label>
        <input type="text" class="modal-input" id="banIdentifier" placeholder="license:xxxxx, discord:xxxxx, or ip:xxxxx">
        <label class="modal-label">Player Name (Optional)</label>
        <input type="text" class="modal-input" id="banPlayerName" placeholder="Enter player name">
        <label class="modal-label">Ban Reason</label>
        <textarea class="modal-textarea" id="banReason" placeholder="Enter ban reason..." rows="3"></textarea>
        <label class="modal-label">Duration (hours, 0 for permanent)</label>
        <input type="number" class="modal-input" id="banDuration" min="0" value="0" placeholder="0">
    `,
    
    changePed: () => {
        let categoryOptions = `<option value="">${t('select_category', 'Select category...')}</option>`;
        for (const category in pedCategories) {
            const label = pedCategories[category].label || category;
            categoryOptions += `<option value="${category}">${t(category, label)}</option>`;
        }
        return `
            <label class="modal-label">${t('select_ped_category', 'Select Ped Category')}</label>
            <select class="modal-select" id="pedCategory" onchange="updatePedOptions()">
                ${categoryOptions}
            </select>
            <label class="modal-label">${t('select_ped', 'Select Ped')}</label>
            <select class="modal-select" id="pedModel" disabled>
                <option value="">${t('select_category_first', 'Select category first...')}</option>
            </select>
            <label class="modal-label">${t('custom_ped_code', 'Or Enter Custom Ped Code')}</label>
            <input type="text" class="modal-input" id="customPedCode" placeholder="e.g., a_c_dog, s_m_y_cop_01">
            <p style="color: #64748b; font-size: 12px; margin-top: 5px;">${t('ped_warning', 'Warning: This will change the player\'s appearance. Use Reset Ped to return to normal.')}</p>
        `;
    }
}

function updateUnreadBadge() {
    const badge = document.getElementById('adminChatUnread');
    if (unreadMessages > 0) {
        badge.textContent = unreadMessages;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

let currentTheme = localStorage.getItem('multyAdminTheme') || 'dark';

function initializeTheme() {
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('themeIcon').className = 'fas fa-sun';
    }
}

function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        icon.className = 'fas fa-moon';
        currentTheme = 'dark';
    } else {
        body.classList.add('light-theme');
        icon.className = 'fas fa-sun';
        currentTheme = 'light';
    }
    
    localStorage.setItem('multyAdminTheme', currentTheme);
}

initializeTheme();

function updateModalButtonTranslations() {
    const cancelBtn = document.querySelector('.modal-btn-secondary');
    if (cancelBtn) cancelBtn.textContent = t('cancel', 'Cancel');
    
    const confirmBtn = document.querySelector('.modal-btn-primary');
    if (confirmBtn) confirmBtn.textContent = t('confirm', 'Confirm');
    
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) themeToggle.title = t('toggle_theme', 'Toggle theme');
}

window.addEventListener('load', () => {
    updateModalButtonTranslations();
});
document.addEventListener('DOMContentLoaded', initializeTheme);

let currentBans = [];

function refreshBanList() {
    sendCommand('getBanList');
}

function renderBanList(bans) {
    currentBans = bans;
    const banList = document.getElementById('banList');
    
    if (!bans || bans.length === 0) {
        banList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-ban"></i>
                <p>${t('no_bans_found', 'No bans found')}</p>
            </div>
        `;
        return;
    }
    
    banList.innerHTML = bans.map(ban => {
        const isPermanent = ban.expire === 0;
        const expireDate = isPermanent ? t('permanent_ban', 'Permanent') : new Date(ban.expire * 1000).toLocaleString();
        const timeLeft = !isPermanent ? getTimeRemaining(ban.expire) : '';
        
        return `
            <div class="ban-item" data-ban-id="${ban.id}">
                <div class="ban-header">
                    <span class="ban-id">#${ban.id}</span>
                    <span class="ban-status ${isPermanent ? 'permanent' : 'temporary'}">
                        <i class="fas ${isPermanent ? 'fa-infinity' : 'fa-clock'}"></i>
                        ${isPermanent ? t('permanent_ban', 'Permanent') : timeLeft}
                    </span>
                </div>
                <div class="ban-details">
                    <div class="ban-detail">
                        <span class="ban-label">${t('player_name', 'Player Name')}</span>
                        <span class="ban-value">${ban.name || 'Unknown'}</span>
                    </div>
                    <div class="ban-detail">
                        <span class="ban-label">${t('banned_by', 'Banned By')}</span>
                        <span class="ban-value">${ban.bannedby}</span>
                    </div>
                    <div class="ban-detail">
                        <span class="ban-label">${t('ban_expires', 'Expires')}</span>
                        <span class="ban-value">${expireDate}</span>
                    </div>
                    <div class="ban-detail">
                        <span class="ban-label">${t('identifiers', 'Identifiers')}</span>
                        <span class="ban-value" style="font-size: 12px;">
                            ${ban.license ? `<i class="fas fa-id-card"></i> ${ban.license}<br>` : ''}
                            ${ban.discord ? `<i class="fab fa-discord"></i> ${ban.discord}<br>` : ''}
                            ${ban.ip ? `<i class="fas fa-network-wired"></i> ${ban.ip}` : ''}
                        </span>
                    </div>
                </div>
                <div class="ban-reason">
                    <strong>${t('ban_reason', 'Reason')}:</strong> ${ban.reason}
                </div>
                <div class="ban-actions">
                    ${hasPermission('unban') ? `<button class="option-btn danger" onclick="unbanPlayer(${ban.id})"><i class="fas fa-unlock"></i> ${t('unban', 'Unban')}</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function getTimeRemaining(expireTimestamp) {
    const now = Math.floor(Date.now() / 1000);
    const remaining = expireTimestamp - now;
    
    if (remaining <= 0) return 'Expired';
    
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

function searchBans() {
    const searchTerm = document.getElementById('banSearch').value.toLowerCase();
    const filteredBans = currentBans.filter(ban => {
        return (ban.name && ban.name.toLowerCase().includes(searchTerm)) ||
               (ban.reason && ban.reason.toLowerCase().includes(searchTerm)) ||
               (ban.license && ban.license.toLowerCase().includes(searchTerm)) ||
               (ban.discord && ban.discord.toLowerCase().includes(searchTerm)) ||
               (ban.bannedby && ban.bannedby.toLowerCase().includes(searchTerm)) ||
               ban.id.toString().includes(searchTerm);
    });
    renderBanList(filteredBans);
}

function showOfflineBan() {
    showModal(t('offline_ban', 'Offline Ban'), modalTemplates.offlineBan(), () => {
        const identifier = document.getElementById('banIdentifier').value;
        const name = document.getElementById('banPlayerName').value;
        const reason = document.getElementById('banReason').value;
        const duration = parseInt(document.getElementById('banDuration').value) || 0;
        
        if (identifier && reason) {
            sendCommand('offlineBan', {
                identifier: identifier,
                name: name || 'Unknown',
                reason: reason,
                duration: duration
            });
        }
    });
}

function unbanPlayer(banId) {
    showModal(t('confirm_unban', 'Confirm Unban'), modalTemplates.confirm(t('confirm_unban', 'Are you sure you want to unban this player?')), () => {
        sendCommand('unbanPlayer', { banId: banId });
        setTimeout(refreshBanList, 500);
    });
}

window.addEventListener('message', function(event) {
    if (event.data.type === 'receiveBanList') {
        renderBanList(event.data.bans);
    }
});

function handleTabSwitch(tabName) {
    if (tabName === 'bans' && hasPermission('viewBans')) {
        refreshBanList();
    }
}
