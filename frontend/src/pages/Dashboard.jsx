import { useEffect, useState } from "react"

import api from "../services/api"

import RoundChart from "../components/RoundChart"

import ExperimentChart from "../components/ExperimentChart"

export default function Dashboard() {

    const [metrics, setMetrics] = useState(null)

    const [versions, setVersions] = useState([])

    const [blocked, setBlocked] = useState([])
    const [experiments, setExperiments] = useState([])

    const [trust, setTrust] =
        useState({})

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



        api
            .get(
                "/experiments"
            )
            .then(
                r =>
                    setExperiments(
                        r.data.experiments
                    )
            )

        api
            .get("/trust")
            .then(
                r => setTrust(
                    r.data.scores
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

                <ExperimentChart data={experiments} />

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




            <h2 className="text-2xl mt-10 mb-4">
                Trust Leaderboard
            </h2>

            <div className="border p-4">

                {
                    Object.entries(trust)
                        .map(
                            ([client, score]) => (
                                <div
                                    key={client}
                                    className="flex justify-between border-b py-2"
                                >

                                    <span>
                                        {client}
                                    </span>

                                    <span>
                                        {score}
                                    </span>

                                </div>
                            ))
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


            <div className="border rounded p-5">

                Latest Trust

                <h2>

                    {

                        Math.round(
                            metrics.avg_trust
                        )

                    }

                </h2>

            </div>


            <div className="mt-10">

                <h2 className="text-2xl mb-4">

                    Experiment History

                </h2>

                {

                    experiments.map(

                        (exp, index) =>

                            <div
                                key={index}
                                className="border p-3 mb-2"
                            >

                                Round:
                                {exp.round}

                                |
                                Accuracy:
                                {exp.accuracy?.toFixed(2)}%

                                Trust:
                                {exp.avg_trust}

                                |

                                Blocked:
                                {exp.blocked}

                            </div>

                    )

                }

            </div>





        </div>

    )

}