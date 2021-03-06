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
import { timeout, TimeoutError } from 'promise-timeout';
import { Dispatch, Reducer } from 'redux';
import Actions from '../../redux/actions';
import { AssetType, RuntimeState, SET_BALANCE, SET_TRANSFERS, TRANSFER, WITHDRAW_ONG } from '../../redux/runtime';
import { transfer, withdrawOng } from '../api/runtimeApi';

const defaultState: RuntimeState = { ongAmount: 0, ontAmount: 0, unboundAmount: 0, transfers: [] };

export const runtimeReducer: Reducer<RuntimeState> = (state = defaultState, action) => {
  switch (action.type) {
    case SET_BALANCE:
      return { ...state, ongAmount: action.ongAmount, ontAmount: action.ontAmount, unboundAmount: action.unboundAmount };
    case SET_TRANSFERS:
      return { ...state, transfers: action.transfers };
    default:
      return state;
  }
};

export const runtimeAliases = {
  [TRANSFER]: (action: any) => {
    return async (dispatch: Dispatch) => {
      try {
        const password: string = action.password;
        const recipient: string = action.recipient;
        const asset: AssetType = action.asset;
        const amount: string = action.amount;
        
        await timeout(transfer(password, recipient, asset, amount), 15000);

        dispatch(
          Actions.transaction.setTransactionResult(true, null)
        );
      } catch (e) {
        if (e instanceof TimeoutError) {
          dispatch(
            Actions.transaction.setTransactionResult(false, 'TIMEOUT')
          );
        } else {
          dispatch(
            Actions.transaction.setTransactionResult(false, 'WRONG_PASSWORD')
          );
        }
      }
    }
  },
  [WITHDRAW_ONG]: (action: any) => {
    return async (dispatch: Dispatch) => {
      try {
        const password: string = action.password;
        const amount: string = action.amount;
        
        await timeout(withdrawOng(password, amount), 15000);

        dispatch(
          Actions.transaction.setTransactionResult(true, null)
        );
      } catch (e) {
        if (e instanceof TimeoutError) {
          dispatch(
            Actions.transaction.setTransactionResult(false, 'TIMEOUT')
          );
        } else {
          dispatch(
            Actions.transaction.setTransactionResult(false, 'WRONG_PASSWORD')
          );
        }
      }
    }
  }
}
