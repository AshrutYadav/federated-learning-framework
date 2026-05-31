import { useEffect, useState } from "react"

import api from "../services/api"

import RoundChart from "../components/RoundChart"

export default function Dashboard() {

    const [metrics, setMetrics] = useState(null)

    const [versions, setVersions] = useState([])

    const [blocked, setBlocked] = useState([])

    const load = () => {


        api
            .get("/metrics")
            .then(
                r => setMetrics(
                    r.data
                )
            )

        api
            .get(
                "/model_versions"
            )
            .then(
                r =>
                    setVersions(
                        r.data.versions
                    )
            )

        api
            .get(
                "/blocked_clients"
            )
            .then(
                r =>
                    setBlocked(
                        r.data.blocked
                    )
            )

    }

    useEffect(() => {

        load()

        const interval =

            setInterval(
                load,
                3000
            )

        return () => clearInterval(
            interval)

    }, [])

    if (!metrics)
        return <h1>Loading...</h1>

    return (

        <div className="p-10">

            <h1 className="text-4xl mb-10">

                Federated Dashboard

            </h1>

            <div className="grid grid-cols-4 gap-5">

                <div className="border rounded p-5">

                    Round

                    <h2 className="text-3xl">

                        {
                            metrics.current_round
                        }

                    </h2>

                </div>

                <div className="border rounded p-5">

                    Clients

                    <h2 className="text-3xl">

                        {
                            metrics.total_clients
                        }

                    </h2>

                </div>

                <div className="border rounded p-5">

                    Updates

                    <h2 className="text-3xl">

                        {
                            metrics.total_updates
                        }

                    </h2>

                </div>

                <div className="border rounded p-5">

                    Blocked

                    <h2 className="text-3xl">

                        {
                            metrics.blocked_clients
                        }

                    </h2>

                </div>

            </div>

            <div className="mt-10">

                <RoundChart />

            </div>

            <div className="mt-10">

                <h2 className="text-2xl mb-4">

                    Model Versions

                </h2>

                {

                    versions
                        .filter(
                            (v, index, self) =>

                                index === self.findIndex(

                                    x =>

                                        x.round === v.round
                                        &&
                                        x.path === v.path

                                )

                        )

                        .map(

                            (v, index) =>

                                <div
                                    key={index}
                                    className="border p-3 mb-2"
                                >

                                    Round {v.round}

                                    <br />

                                    {v.path}

                                </div>

                        )


                }

            </div>

            <div className="mt-10">

                <h2>

                    Blocked Clients

                </h2>

                {

                    blocked.map(

                        (c, i) =>

                            <div
                                key={i}
                                className="border p-3"
                            >

                                {c}

                            </div>

                    )

                }

            </div>





        </div>

    )

}