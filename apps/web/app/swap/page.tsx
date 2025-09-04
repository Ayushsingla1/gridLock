"use client"
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch"
import { FaDownLong } from "react-icons/fa6";
import { readContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { contractABI, contractAddress, usdContractAddress } from "../../utils/contractInfo";
import { config } from "../../utils/wagmiProvider";
import { erc20Abi } from "viem";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const App = () => {

    const [data, setData] = useState({
        amount : null,
        betYes : true
    })

    const {address} = useAccount();
    const [exchangeAmount,setExchangeAmount] = useState<string|number>("-")
    const gameId = "first";

    const changeHandler = async(e : any) => {
        const {name, value} = e.target;
            setData(prev => ({
            ...prev,
            [name] : value
        }))
        console.log(data);
        console.log(value);
        await getPrice("first",value);
    }


    const buy = async(price : number) => {

        const bet = (data.betYes === true);
        console.log(price, bet, data.amount);
        const res = await writeContract(config,{
            abi : contractABI,
            address : contractAddress,
            functionName : "stakeAmount",
            args : [gameId,data.amount,bet,BigInt(price.toString())]
        })

        const confirmation = await waitForTransactionReceipt(config,{
            hash : res
        })

        if(confirmation) alert("success")
        else alert("fail");
    }

    const purchaseHandler = async() => {
        if(!data.amount) return;

        const result = await readContract(config,{
            address : usdContractAddress,
            abi : erc20Abi,
            functionName : "allowance",
            args : [address!,contractAddress]
        })

        const approveAmount = parseInt(result.toString());

        console.log(result);

        const price = await getPrice(gameId,data.amount);
        const finalPrice = Math.ceil(price/(10**6));

        console.log(finalPrice);

        if(approveAmount > finalPrice){
            await buy(finalPrice)
        }

        else{

            const allowResult = await writeContract(config,{
                address : usdContractAddress,
                abi : erc20Abi,
                functionName : "approve",
                args : [contractAddress,BigInt((finalPrice).toString())]
            })

            const confirmation = await waitForTransactionReceipt(config,
                {
                    hash : allowResult
                }
            )

            console.log("confirmation for allowance", confirmation);

            if(confirmation) await buy(finalPrice);
        }
    }

    const getPrice = async(gameId : string, amount : number) => {
        console.log(gameId, amount , data.betYes);
        const res : BigInt = await readContract(config,{
            abi : contractABI,
            functionName : "getAmount",
            args : [gameId, data.betYes, BigInt(String(amount))],
            address : contractAddress
        }) as BigInt;

        console.log(res);

        console.log(parseInt(res.toString())/10**12)
        setExchangeAmount(parseInt(res.toString())/10**12);
        return parseInt(res.toString());
    }

    return <div className="flex w-screen h-screen justify-center items-center">
        <ConnectButton/>
        <div className="flex flex-col gap-y-4 w-3/12 bg-gray-700 rounded-2xl p-10">

        <div>

        </div>
        <Switch name="betYes" checked = {data.betYes} onCheckedChange={() => setData(prev => ({...prev,betYes : !prev.betYes}))} color="white" className="self-end"></Switch>
            <div className="w-full bg-transparent opacity-70 flex flex-col">
                <label htmlFor="amount">Select Amount</label>
                <input type="number" min={1} name="amount" onChange={e => changeHandler(e)} id="amount"></input>
            </div>
            <div className="self-center"><FaDownLong/></div>
            <div>
                <div>Amount to pay</div>
                <div>{exchangeAmount}</div>
            </div>
            <button onClick = {purchaseHandler}>Buy</button>
        </div>
    </div>
}

export default App;