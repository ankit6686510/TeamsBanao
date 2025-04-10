#teamsbanao api

##auth router
-Post /signup
-Post /login
-Post /logout


##profileRouter
-Get /profile/view  
-Patch /profile/edit  
-Patch /profile/password

##connection request router
-Post /request/send/interested/:userId
-Post /request/send/ignored/:userId
-Post /request/review/accepted/:requestId
-Post /request/review/rejected/:requestId

##user router
-Get /user/connections
-Get /user/connections
-Get /user/connections