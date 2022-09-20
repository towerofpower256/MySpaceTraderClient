import MyPageSubTitle from "../Components/MyPageSubTitle"
import MyPageTitle from "../Components/MyPageTitle"


export default function HelpPage(props) {


    return (
        <div>
            <MyPageTitle>Help</MyPageTitle>
            <p>Welcome to Space Trader!</p>
            <p>
                This web UI was created by me, David McDonald, to teach me how to create a web app. I hope you like it.
            </p>
            <p>
                The goal of the game is to make as much money as you can. You do this primarily by trading.
                <ol>
                    <li>Buy goods at a low price</li>
                    <li>Move your ship(s) to a different location</li>
                    <li>Sell goods at a high price</li>
                </ol>
            </p>
            <MyPageSubTitle>Getting started</MyPageSubTitle>
            <p>
                When you open a new account, you'll start with no money and no ships. I'd recommend you start by following the below steps.
                <ol>
                    <li>Take out a loan by opening the <b>Player</b> page and taking out a <b>"Start up"</b> loan.</li>
                    <li>Buy your first ship by opening the <b>Market - Ship Market</b>. I'd recommend the <b>Hermes HM-MK-I</b> from <b>OE-PM-TR</b>.</li>
                    <li>Buy some fuel for your new ship by opening the Command page. 10 fuel should get you started.</li>
                    <li>Start trading! A good reliable trade in the OE system is buying <b>metals</b> from <b>OE-PM-TR</b> and selling them at <b>OE-PM</b>.</li>
                </ol>
            </p>

            <MyPageSubTitle>Moving around a system</MyPageSubTitle>
            <p>
                Moving involves you submitting a new flight plan to move one of your ships from one location to another.
            </p>
            <p>
                Moving consumes fuel, depending on how away the location is. Departing from a planet consumes a little more fuel (usually 2+ fuel).
            </p>
            <p>
                Your ships will take time to move from one location to another. How long this takes depends on the ship's speed and the distance between the start and end of the flight plan.
            </p>

            <MyPageSubTitle>Moving between systems</MyPageSubTitle>
            <p>
                Moving between systems is slightly different.
            </p>
            <p>To move a ship to a different system, first move the ship to a wormhole. You can identify these locations by their name which includes W (wormhole) and the destination system. <br />
                For example "OE-W-XV" is w wormhole in the OE system that links to the XV system.
            </p>
            <p>
                Once a ship is at a wormhole, open the Move form on the ship command page and click on "Attempt warp jump".
                If successful, the ship will enter a flight plan towards the next system. Using wormholes doesn't consume any fuel, and always takes 1 min 40 secs to travel, regardless of the ship type.
            </p>

            <MyPageSubTitle>Trading</MyPageSubTitle>
            <p>
                Trading involves a ship buying or selling goods at a location.
            </p>
            <p>
                The amount of goods you can purchase is limited by either:
                <ul>
                    <li>How much money you have.</li>
                    <li>How much cargo your ship can carry.</li>
                    <li>How much of the good is available at the location.</li>
                </ul>
                There is typically no limit to how much you can sell, and you can sell as much as your ship is carrying.
            </p>
            <p>
                The quantity of goods being purchases would normally be limited to the ship's loading speed, however the UI should automatically make the purchase in batches for you.
                <br />For example, a ship with a loading speed of 25 trying to purchase 50 metal would need to make 2 purchases of 25x metal each.
            </p>
            <p>
                Trades affect the market at a location. Goods being purchased by you and other players will slowly increase the buy and sell price of that good at that location, and goods being sold by you and other players will slowly lower prices. If enough trades at a location are being made, a trading route can become unprofitable as prices change.
            </p>

            <MyPageSubTitle>Finding good deals</MyPageSubTitle>
            <p>
                I've included some tools to help you find profitable trades.
            </p>
            <p>
                The <b>Market Dashboard</b> will show you a system, locations within it, and the market data that's visible to you.
            </p>
            <p>
                The <b>Market Report</b> shows you all of the market data that's visible to you in a list that's filterable and sortable.
            </p>
            <p>
                The <b>Deal Finder</b> will go through all of the market data that's visible to you and find good trades. I'm quite proud of this feature.
            </p>
        </div>
    )
}