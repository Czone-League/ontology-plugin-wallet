/*
 * Copyright (C) 2018 Matus Zamborsky
 * This file is part of The Ontology Wallet&ID.
 *
 * The The Ontology Wallet&ID is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Ontology Wallet&ID is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with The Ontology Wallet&ID.  If not, see <http://www.gnu.org/licenses/>.
 */
import { getAddress } from '../api/authApi';
import { setBalance, setTransfers } from '../redux/runtime';
import { getTransferList } from './api/explorerApi';
import { getBalance, getUnboundOng } from './api/runtimeApi';
import { store } from './redux';

window.setInterval(async () => {
  const state = store.getState();  
  const walletEncoded = state.wallet.wallet;
  
  if (walletEncoded !== null) {
    const balance = await getBalance();
    const unboundOng = await getUnboundOng();

    store.dispatch(
      setBalance(balance.ong / 1000000000, balance.ont, unboundOng / 1000000000)
    );

    const address = getAddress(walletEncoded);

    const transfers = await getTransferList(address);
    
    store.dispatch(
      setTransfers(transfers)
    );
  }
}, 5000);
