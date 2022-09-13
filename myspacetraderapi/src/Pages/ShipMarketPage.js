import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getShipMarket, buyNewShip } from "../Services/SpaceTraderApi.js";
import { loadPlayerInfo, loadPlayerShipsData, loadSystemsData, savePlayerShipsData } from "../Services/LocalStorage.js";

import prettyNumber from "../Utils/prettyNumber.js";
import getLocationName from "../Utils/getLocationName.js";
import insertOrUpdate from "../Utils/insertOrUpdate.js";
import getGoodName from "../Utils/getGoodName.js";
import sortCompareAlphabetically from "../Utils/sortCompareAlphabetically.js";

import PlayerShipsContextSet from "../Contexts/PlayerShipsContextSet";
import PlayerInfoContextSet from "../Contexts/PlayerInfoContextSet";

import MarketHeader from "./Components/MarketHeader.js";
import MyPageSubTitle from "../Components/MyPageSubTitle.js";
import PlaceholderTableRows from "../Components/PlaceholderTableRows.js";
import MyPageTitle from "../Components/MyPageTitle.js"
import Button from "react-bootstrap/esm/Button.js";
import Modal from "react-bootstrap/esm/Modal.js";
import Table from "react-bootstrap/esm/Table.js";
import Spinner from "react-bootstrap/esm/Spinner.js";
import Form from "react-bootstrap/esm/Form.js";

export default function ShipMarketPage(props) {
    const [isLoading, setLoading] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [data, setData] = useState([]);
    const [buyModalState, setBuyModalState] = useState({});
    const [systemList, setSystemList] = useState([]);
    const [filterSystem, setFilterSystem] = useState(null);

    useEffect(() => {
        if (!isLoaded) refreshData();
        updateSystemList();
    }, []);

    function updateSystemList() {
        let systemData = loadSystemsData();
        if (!Array.isArray(systemData.systems)) {
            setSystemList([]);
        } else {
            setSystemList(
                systemData.systems.map((s) => {
                    return { name: s.name, symbol: s.symbol }
                })
            );
        }

    }

    function showBuyModal(ship) {
        buyModalState.ship = ship;
        buyModalState.show = true;
        setBuyModalState({ ...buyModalState });
    }

    function closeBuyModal() {
        buyModalState.show = false;
        setBuyModalState({ ...buyModalState });
    }

    function refreshData() {
        if (isLoading) return;

        setLoading(true);
        setData([]);
        getShipMarket()
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error("Error loading ship market. " + stcResponse.errorPretty);
                    return
                }

                const ships = stcResponse.data.ships;
                if (Array.isArray(ships)) {
                    const _data = [];
                    ships.forEach((ship) => {
                        if (Array.isArray(ship.purchaseLocations)) {
                            ship.purchaseLocations.forEach((pl) => {
                                let s = { ...ship };
                                s.purchaseLocations = undefined;
                                s.system = pl.system;
                                s.location = pl.location;
                                s.price = pl.price;
                                _data.push(s);
                            })

                        }
                    })

                    _data.sort((a, b) => sortCompareAlphabetically(a.type, b.type));
                    setData(_data);
                    setLoaded(true);
                } else {
                    toast.error("Error loading ship market, data was missing from the response");
                    return;
                }
            })
            .catch(ex => {
                toast.error("Error loading the ship market." + ex);
            })
            .finally(() => {
                setLoading(false);
            });
    }



    function PageWrapper(props) {
        return (
            <div>
                <MarketHeader />
                <MyPageSubTitle>Ship Market</MyPageSubTitle>
                {props.children}
            </div>
        )
    }

    return (
        <PageWrapper>
            <Form.Group className="mb-3" controlId="shipMarketFilterSystem">
                <Form.Label>System</Form.Label>
                <Form.Select value={filterSystem} onChange={(e) => setFilterSystem(e.target.value)}>
                    <option value="">(all)</option>
                    {systemList.map((s) => {
                        return (<option value={s.symbol}>{s.symbol} ({s.name})</option>)
                    })}
                </Form.Select>
            </Form.Group>
            <Table size="sm" responsive>
                <thead>
                    <tr>
                        <th>Ship</th>
                        <th>Cargo</th>
                        <th>Loading speed</th>
                        <th>Speed</th>
                        <th>Restrictions</th>
                        <th>System</th>
                        <th>Location</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && <PlaceholderTableRows colCount={9} rowCount={3} />}
                    {!isLoading &&
                        data.filter((ship) => !filterSystem || ship.system === filterSystem).map((ship, idx) => {
                            return (
                                <tr key={idx}>
                                    <th>
                                        <div style={{width: "max-content"}}>{ship.type}</div>
                                        <div className="text-muted fw-normal">{ship.manufacturer}</div>
                                    </th>
                                    <td>{prettyNumber(ship.maxCargo)}</td>
                                    <td>{prettyNumber(ship.loadingSpeed)}</td>
                                    <td>{ship.speed}</td>
                                    <td>{Array.isArray(ship.restrictedGoods) && ship.restrictedGoods.length > 0 ?
                                        <div className="text-danger">
                                            {ship.restrictedGoods.map((rg) => <div>{getGoodName(rg)}</div>)}
                                        </div>
                                        :
                                        <span className="text-muted">None</span>
                                    }</td>
                                    <td>{ship.system}</td>
                                    <td>{getLocationName(ship.location)}</td>
                                    <td>${prettyNumber(ship.price)}</td>
                                    <td>
                                        <Button variant="primary" onClick={() => showBuyModal(ship)}
                                            data-location={ship.location} data-ship={ship.type}>
                                            Buy
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>

            <Modal show={buyModalState.show} onHide={() => closeBuyModal()}>
                <Modal.Header closeButton>
                    Confirm buy ship
                </Modal.Header>
                <Modal.Body>
                    <ShipMarketBuyShipConfirmModal ship={buyModalState.ship} onComplete={() => closeBuyModal()} />
                </Modal.Body>
            </Modal>
        </PageWrapper>
    )
}

function ShipMarketBuyShipConfirmModal(props) {
    const [isWorking, setWorking] = useState(false);
    const ship = props.ship;
    const location = props.location;
    const onComplete = props.onComplete;
    const [setPlayerShips] = useContext(PlayerShipsContextSet);
    const [setPlayerInfo] = useContext(PlayerInfoContextSet);

    function doOnComplete(...args) {
        if (typeof onComplete === "function") onComplete(...args);
    }

    function purchaseShip() {
        if (isWorking) return;

        setWorking(true);

        buyNewShip(ship.location, ship.type)
            .then((stcResponse) => {
                if (!stcResponse.ok) {
                    toast.error("Error buying ship. " + stcResponse.errorPretty);
                    return;
                }

                toast.success(["Purchased", ship.type, "at", ship.location, "for", "$" + prettyNumber(ship.price)].join(" "));

                const credits = stcResponse.data.credits;
                if (credits) {
                    let playerInfo = loadPlayerInfo();
                    playerInfo.credits = credits;
                    setPlayerInfo(playerInfo);
                }

                const newShip = stcResponse.data.ship;
                if (newShip) {
                    setPlayerShips(insertOrUpdate(loadPlayerShipsData(), newShip, (s) => s.id === newShip.id));
                }

                doOnComplete();
            })
            .catch(error => {
                toast.error("Error buying ship. " + error);
            })
            .finally(() => {
                setWorking(false);
            })
    }

    if (!ship) {
        return (<div></div>);
    }

    return (
        <div>
            <div className="mb-3">Are you sure that you would like to buy this ship?</div>
            <Button variant="primary" onClick={() => purchaseShip()} disabled={isWorking}>
                {isWorking && <Spinner animation="border" role="status" size="sm">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>}
                Buy <span className="fw-bold">{ship.type}</span> at <span className="fw-bold">{getLocationName(ship.location)}</span> for <span className="fw-bold">${(prettyNumber(ship.price))}</span>
            </Button>
        </div>
    )
}

/*
function _ShipMarketPage(props) {
    const [error, setError] = useState(null)
    const [isLoaded, setLoaded] = useState(false)
    const [shipsData, setShipsData] = useState(null);

    useEffect(() => {
        loadAvailableShips();
    }, []);

    function loadAvailableShips() {
        setLoaded(false);
        setError(null);
        setShipsData(null);

        getShipMarket()
            .then(stcResponse => {
                console.log("Loading ship market data:", stcResponse);
                setShipsData(stcResponse.data);
                setLoaded(true);
            })
            .catch(ex => {
                doError("Error reading the response payload: " + error);
            });
    }

    function doError(error) {
        console.error("ERROR", error);
        setError(error);
        setLoaded(true);
    }

    function PageWrapper(props) {
        return (
            <div>
                <MarketHeader />
                <MyPageSubTitle>Ship Market</MyPageSubTitle>
                {props.children}
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <PageWrapper>
                <pre>It's loading</pre>
            </PageWrapper>
        );
    }

    if (error) {
        return (
            <PageWrapper>
                <pre>ERROR: {error}</pre>
            </PageWrapper>
        );
    }

    if (shipsData) {

        let shipItems = shipsData.ships.map((ship, index) => {
            return (
                <ShipMarketItem key={index} ship={ship} />
            );
        });

        return (
            <PageWrapper>
                <div className="container">
                    <div className="row">
                        {shipItems}
                    </div>
                </div>
            </PageWrapper>
        );
    }
}

function ShipMarketItem(props) {
    const [isWorking, setWorking] = useState(false);

    let st = props.ship;

    let purchaseLocationItems = st.purchaseLocations.map((pl, index) => {
        return (
            <tr key={index}>
                <td>{pl.system}</td>
                <td>{pl.location}</td>
                <td>{prettyNumber(pl.price)}</td>
                <td>
                    <Button size="sm" variant="info" disabled={isWorking}
                        data-ship={st.type} data-location={pl.location} data-price={pl.price}
                        onClick={handleBuyShipClick}
                    >Buy</Button>
                </td>
            </tr>
        );
    });

    function handleBuyShipClick(e) {
        purchaseShip(e.target.dataset.location, e.target.dataset.ship);
    }

    function purchaseShip(location, shipType) {
        if (isWorking) return;

        buyNewShip(location, shipType)
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error(stcResponse.errorPretty);
                    return;
                }

                // TODO update player credits
                //const credits = stcResponse.data.credits

                const newShip = stcResponse.data.ship;
                if (newShip) {
                    savePlayerShipsData(insertOrUpdate(loadPlayerShipsData(), newShip, (ship) => ship.id === newShip.id));
                    toast.success("Purchased new ship: " + newShip.type);
                } else {
                    toast.warn("Purchase was successful, but ship details were missing from the response");
                }
            })
            .finally(() => {
                setWorking(false);
            })
    }

    return (
        <div className="col-md-6 col-xs-12" style={{ "margin-bottom": "15px" }}>
            <div className="card">
                <div className="card-header">
                    <h4>{st.type}</h4>
                </div>
                <div className="card-body">
                    <table className="table table-striped">
                        <tbody>
                            <tr>
                                <th>Type</th>
                                <td>{st.type}</td>
                                <th>Max cargo</th>
                                <td>{st.maxCargo}</td>
                            </tr>
                            <tr>
                                <th>Manufacturer</th>
                                <td>{st.manufacturer}</td>
                                <th>Cargo loading speed</th>
                                <td>{st.loadingSpeed}</td>
                            </tr>
                            <tr>
                                <th>Class</th>
                                <td>{st.class}</td>
                                <th>Speed</th>
                                <td>{st.speed}</td>
                            </tr>
                            <tr>
                                <th>Plating</th>
                                <td>{st.plating}</td>
                                <th>Weapons</th>
                                <td>{st.weapons}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h4>Purchase locations</h4>
                    <table className="table table-striped table-hover table-sm">
                        <thead>
                            <tr>
                                <td>System</td>
                                <td>Location</td>
                                <td>Price</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseLocationItems}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
*/