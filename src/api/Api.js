import axios from "axios";
import { add_desclamer, add_notice, add_notification, add_player_notification, add_tournament, add_wallet, base_url, delete_player, get_notice, get_notificationList, get_player, get_player_active, get_player_leaderboard, get_rechargetransaction, get_tournament, get_transaction, get_withdrawList, update_player, get_banned_player, get_approve_withdraw, get_reject_withdraw } from "./Constants";
import { message } from "antd";


// <-------------------> access all player api <-------------------------->

// add player or notification data 
export const addPlayerData = async (PlayerData) => {
  try {
    const response = await axios.post(`${base_url}${add_player_notification}`, PlayerData, {})
    return response
  } catch (error) {
    console.log(error)
    return null
  }
}

// get player 
export const getPlayerData = async (page, pageSize) => {
  try {
    const response = await axios.get(`${base_url}${get_player}`, {
      params: {
        page,
        pageSize,
      },
    });
    return response.data.player;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// update player
export const updatePlayerData = async () => {
  try {
    const response = await axios.post(`${base_url}${update_player}`, {})
  } catch (error) {
    console.log(error)
    return null
  }
}

// delete player
export const deletePlayerData = async () => {
  try {
    // const response = await axios.post(`${base_url}${delete_player}`, {playerId: record._id,})
    const response = await axios.post(`${base_url}${delete_player}`, {})
    console.log('Response from backend:', response.data);

    if(response.data.status === 'success') {
      message.success('Player data deleted successfully');
    } else {
      message.error('Failed to delete player data');
    }
  } catch(error) {
    console.log(error)
  }
}

// getPlayerLeadboardData
export const getPlayerLeadboardData = async () => {
  try {
    const response = await axios.get(`${base_url}${get_player_leaderboard}`, {});
    return response.data.leaderboard;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// getactivePlayerData
export const getactivePlayerData = async () => {
  try {
    const response = await axios.get(`${base_url}${get_player_active}`, {});
    return response.data.activePlayers;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// <-------------------> access all tournament api <-------------------------->

// add tournament
export const addTournamentData = async (tournamentData) => {
  try {
    const response = await axios.post(`${base_url}${add_tournament}`, tournamentData, {})
    return response
  } catch (error) {
    console.log(error)
    return null
  }
}

// get tournament
export const getTournamentData = async () => {
  try {
    const response = await axios.get(`${base_url}${get_tournament}`, {
      // headers: {
      //     Authorization: `Bearer ${token}`,
      // },
    });
    return response.data.tournament;
  } catch (error) {
    console.log(error);
    return null;
  }
};


// wallet
// addWalletAmountData
export const addWalletAmountData = async (walletData) => {
  try {
    const response = await axios.post(`${base_url}${add_wallet}`, walletData, {})
    return response
  } catch (error) {
    console.log(error)
    return null
  }
}

// export const addNotificationData = async (notificationData) => {
//   try {
//     const response = await axios.post(`${base_url}${add_notification}`, notificationData, {})
//     return response
//   } catch (error) {
//     console.log(error)
//     return null
//   }
// }


// <-------------------> access all transaction api <-------------------------->

// get 
export const getAllTransactionData = async () => {
  // debugger;
  try {
    const response = await axios.get(`${base_url}${get_transaction}`, {}) 
    // console.log("API Response:", response.data.transaction);
    return response.data.transaction
  } catch (error) {
    console.log(error)
  }
}

// get
export const getRechargeTransactionData = async () => {
  // debugger;
  try {
    const response = await axios.get(`${base_url}${get_rechargetransaction}`) 
    // console.log("API Response:", response.data.transaction);
    return response.data.transaction
  
  } catch (error) {
    console.log(error)
  }
}

// <----------------------> wallet api start <---------------------->

export const getWithdrawListData = async () => {
  try {
    const response = await axios.get(`${base_url}${get_withdrawList}`) 
    // console.log("API Response:", response.data.transaction);
    return response.data.transaction
  
  } catch (error) {
    console.log(error)
  }
}

// <----------------------> wallet api end <---------------------->

// add desclamer
export const addDesclamerData = async (desclamerData) => {
  try {
    const response = await axios.post(`${base_url}${add_desclamer}`, desclamerData, {})
    return response
  } catch (error) {
    console.log(error)
    return null
  }
}

// <--------------------> notification api <------------------->
// add_notification
export const addNotificationData = async (notificationData) => {
  try {
    const response = await axios.post(`${base_url}${add_notification}`, notificationData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};


// // get /get-notification /get-notification
// export const getNotificationListData = async () => {
//   try {
//     const response = await axios.get(`${base_url}${get_notificationList}`) 
//     // console.log("API Response:", response.data.transaction);
//     return response.data.notification
  
//   } catch (error) {
//     console.log(error)
//   }
// }

// <-------------------> access all notice api <-------------------------->

// add(post) notice
export const addNoticeData = async (noticeData) => {
  try {
    const response = await axios.post(`${base_url}${add_notice}`, noticeData, {})
    return response
  } catch (error) {
    console.log(error)
    return null
  }
} 

// get notice 
export const getNoticeData = async () => {
  try {
    const response = await axios.get(`${base_url}${get_notice}`, {  // ${base_url}${get_notice}
      // headers: {
      //     Authorization: `Bearer ${token}`,
      // },
    });
    return response.data.notice;
  } catch (error) {
    console.log(error);
    return null;
  }
}

//update notice 

// report
// getactivePlayerData
export const getbannedPlayerData = async () => {
  try {
    const response = await axios.get(`${base_url}${get_banned_player}`, {});
    return response.data.bannedPlayers;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// get_approve_withdraw
export const getapproveWithdrawData = async () => {
  try {
    const response = await axios.get(`${base_url}${get_approve_withdraw}`, {});
    return response.data.approveWithdraw;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// get_rejected_withdraw   rejectedWithdraw
export const getrejectedWithdrawData = async () => {
  try {
    const response = await axios.get(`${base_url}${get_reject_withdraw}`, {});
    return response.data.rejectedWithdraw;
    
  } catch (error) {
    console.log(error);
    return null;
  }
};