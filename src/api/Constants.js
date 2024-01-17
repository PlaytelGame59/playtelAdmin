export const base_url = "http://localhost:4000"

// export const base_url =`http://162.240.146.1:2000/`

// admin login api
export const admin_login = "/admin/login" // /admin/login
export const admin_signup = "/admin/signup" // /admin/signup
export const reset_password = "/admin/reset-password"

// Player api
export const add_player_notification = "/admin/players-create"    
export const get_player = "/admin/players-list" 
export const update_player = "/admin/update-players"
export const delete_player = "/admin/delete-players-data" // /player/delete-players-data

export const get_player_leaderboard = "/admin/leaderboard" // get_player_leaderboard
export const get_player_active = "/admin/active"   // get_player_active 

// tournament api
export const add_tournament = "/admin/add-tournament"  // /admin/add-tournament         
export const get_tournament = "/admin/tournaments-list"
export const update_tournament = "/admin/update-tournament"  // /admin/update-tournament
export const delete_tournament = "/admin/delete-tournaments-data" // /admin/delete-tournaments-data


// wallet api
export const get_withdrawList = "/admin/withdraw/request"  // withdraw/request
export const add_wallet = "/admin/add-wallet" // add_wallet
export const delete_wallet = "" //    

// report player module
// transaction api
export const get_transaction = "/admin/transaction-list"  // /player/transaction-list
export const get_rechargetransaction = "/admin/transaction-list"

export const get_banned_player = "/admin/banned-player"   // /banned-player
export const banned_player_status = "/admin/update-player-status"
export const get_approve_withdraw = "/admin/approve-withdraw"
export const get_reject_withdraw = "/admin/reject-withdraw" // /reject-withdraw

// add_desclamer (privacy policy)
export const add_desclamer = "/admin/add-disclamer" // add_desclamer url

// Notification api
export const add_notification = "/admin/add-notification"
// export const get_notificationList = "/player/get-notification"

// Notice api
export const add_notice = "/notice/notices-create"
export const get_notice = "/notice/notices-list"
export const update_notice = "/notice/update-notices" // /notice/update-notices
export const delete_notice = "/notice/delete-notices-data" // /notice/delete-notices-data