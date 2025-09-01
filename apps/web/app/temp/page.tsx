"use client"

import { readContract, waitForTransactionReceipt, writeContract } from "@wagmi/core"
import { config } from "../../utils/wagmiProvider"
import { erc20Abi } from "viem"
import { contractABI, contractAddress, usdContractAddress } from "../../utils/contractInfo"
import { useState } from "react"

const App = () => {
    const [data,setData] = useState({
        stakeAmount : 0,
        betYes : 2
    })
    const submitHandler = async() => {
        const res = await writeContract(config,{
            abi : erc20Abi,
            address : usdContractAddress,
            functionName : "approve",
            args : [contractAddress,10000000000000000000n]
        })
        const finalize = await waitForTransactionReceipt(config,{
            hash : res
        })

        if(finalize.status === "success"){
            const stakeAmountHash = await writeContract(config,{
                abi : contractABI,
                address : contractAddress,
                functionName : "stakeAmount",
                args : ["123",
                    10n,
                    1n,
                    1000000000n
                ]
            })

            const finalizeStake = await waitForTransactionReceipt(config,{
                hash : stakeAmountHash
            })
        }
        console.log(res);
        console.log(finalize);
    }

    const getPrice = async(gameId : string) => {
        console.log(gameId, data.stakeAmount , data.betYes);
        if((data.betYes != 0 )&& (data.betYes != 1)) return ;
        const res = await readContract(config,{
            abi : contractABI,
            functionName : "getAmount",
            args : [gameId, data.betYes, data.stakeAmount],
            address : contractAddress
        })
        console.log(res);
    }

    const changeHandler = (e : any) => {
        const {name,value} = e.target;
        setData(prev => ({
            ...prev,
            [name] : value
        }))
    }

    return <div>
        <button onClick={submitHandler}> stake it </button>
        <input name="stakeAmount" type="number" value={data.stakeAmount} onChange={changeHandler} className="bg-white text-red-400"></input>
        <input name="betYes" type="number" value={data.betYes} onChange={changeHandler} className="bg-white text-red-400"></input>
        <button onClick={() => getPrice("first_game")}>getPrice</button>
    </div>

}

export default App;