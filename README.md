# Hot Pot

Takeaways freshly delivered from the neighbourhood.

## Prerequisites

- Node.js and the NPM package manager
- PostgreSQL
- Bower
- Grunt
- Sails

## Installing

### Node.js
Install Bower dependencies:
```
bower install
```

Install NPM dependencies:
```
npm install
```

### PostgreSQL
Create PostgreSQL user with username "hotpot-admin" and password "admin":
```
createuser hotpot-admin --login --pwprompt
```

Create PostgreSQL database:
```
createdb hotpot
```

### User authentication
In order to use Facebook authentication, create an app at Facebook Developers(https://developers.facebook.com/): 
- When created, an app is assigned an **App ID** and **App Secret**. 
- Add the **App ID** and **App Secret** to *config/passport-template.js* and rename the file *config/passport.js*
- Make sure that the *Valid OAuth Redirect URIs* field is set to "http://localhost:1337/".

### Braintree payments
In order to use the payment system, create a Braintree Sandbox account and generate API keys.
- Add the **Merchant ID**, **Public Key** and **Private Key** to *config/braintree-template.js* and rename the file *config/braintree.js*.

## Running the program
```
sails lift
```

### Create caterer
- Create caterer, go to *http://localhost:1337/#/caterer-signup*.
- Add caterer details and dishes.

### Go online as caterer
- To go online as caterer, go to *http://localhost:1337/#/caterer-app/go-online*.
- Select dishes, and the preparation time and Available portions for each dish.
- Click on the "Go Online" button.

### Order a dish as customer
- To order a dish as customer, click on "Sign in" and use "Facebook Sign in".
- Enter a postcode and click on "Find food".
- The next page shows dishes provided by online caterer in the area.
- Select dishes to order (Dishes can only be ordered from one caterer at a time).
- The next page shows more dishes provided by the caterer; click on "Checkout" to proceed with the order.
- Fill in payment using the Braintree testing credit cards (https://developers.braintreepayments.com/guides/credit-cards/testing-go-live/node) and confirm payment.
- The order status page opens. It should be updated in real time (refresh page in case of a websocket error).
- Payments details are saved in the Braintree vault and can be retrieved during the next order.

### Handle orders as caterer
- Once online, a caterer can receive orders, and view existing orders.
- Click on an order to interact with it and update the customer order status page.

### Go online as Driver
- To go online as driver, go to *http://localhost:1337/#/driver/go-online*.
- Click on go online.
- An order appears after a few seconds; the route is displayed on the map.
- Click on "Swipe to accept delivery" to accept order and view route.
- Confirm pick up to complete order.

## TODO
- Migrate Bower dependencies to NPM
- Migrate AngularJS to Angular 5 and cleanup Angular integration with SailsJS
- Add unit tests
- Automate deployment to AWS
