import axios from "axios";
import { add_desclamer, add_notice, add_notification, add_player_notification, add_tournament, add_wallet, base_url, delete_player, get_notice, get_notificationList, get_player, get_player_active, get_player_leaderboard, get_rechargetransaction, get_tournament, get_transaction, get_withdrawList, update_player, get_banned_player, get_approve_withdraw, get_reject_withdraw, get_player_report, getKYCRequest } from "./Constants";
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
    return response.data.playerList;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// /tournament/details
export const getPlayerdetailReport = async (page, pageSize) => {
  try {
    const response = await axios.get(`${base_url}${get_player_report}`, {
      params: {
        page,
        pageSize,
      },
    })
    return response.data.detailedReport
  
  } catch (error) {
    console.log(error)
  }
}

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
    return response.data.playerHistory;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// getactivePlayerData
export const getactivePlayerData = async () => {
  try {
    const response = await axios.get(`${base_url}${get_player_active}`, {});
    return response.data.players;
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
    const response = await axios.get(`${base_url}${get_tournament}`, {});   
    // console.log('API Response:', response.data); 
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
export const getAllTransactionData = async (player_id) => {
  try {
    const response = await axios.post(`${base_url}${get_transaction}`, {
      params: { player_id }
    });
    console.log("ewfwef", response.data)
    return response.data.data;
  } catch (error) {
    console.log(error);
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
    return response.data.data
  
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


// gameHistory
export const gameHistory = async () => {
  try {
    const response = await axios.get(`${base_url}${get_player_report}`, {});
    return response.data.player;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// get_adharKYCRequest
export const getKYCRequestData = async (page, pageSize) => {
  try {
    const response = await axios.get(`${base_url}${getKYCRequest}`, {
      params: {
        page,
        pageSize,
      },
    });
    return response.data.combinedData ;
  } catch (error) {
    console.log(error);
    return null;
  }
}


// update_withdraw_request


// const handleAadharApproval = async (record) => {
//   try {
//     // Make an API call to update Aadhar approval status
//     await axios.post(`/approve/aadhar/${record._id}`);
//     mainPlayerData(); // Refresh the player data after approval
//   } catch (error) {
//     console.error(error);
//     message.error('Failed to approve Aadhar');
//   }
// };

// const handlePanApproval = async (record) => {
//   try {
//     // Make an API call to update PAN approval status
//     await axios.post(`/approve/pan/${record._id}`);
//     mainPlayerData(); // Refresh the player data after approval
//   } catch (error) {
//     console.error(error);
//     message.error('Failed to approve PAN');
//   }
// };



