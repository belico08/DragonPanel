import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, StateToken } from "@ngxs/store";
import { catchError, EMPTY, firstValueFrom, tap } from "rxjs";
import { Login } from "./authentication.actions";
import { AuthenticationService } from "./authentication.service";

export interface AuthenticationStateModel {
  token: string | null;
  username: string | null;
  loading: boolean;
}

export const AUTHENTICATION_STATE_TOKEN = new StateToken<AuthenticationStateModel>('authentication');

@State<AuthenticationStateModel>({
  name: AUTHENTICATION_STATE_TOKEN,
  defaults: {
    token: null,
    username: null,
    loading: false
  }
})
@Injectable()
export class AuthenticationState {
  @Selector()
  static token(state: AuthenticationStateModel): string | null {
    return state.token;
  }

  @Selector()
  static isAuthenticated(state: AuthenticationStateModel): boolean {
    return !!state.token;
  }

  constructor(private authenticationService: AuthenticationService) {}

  // @Action(Login)
  // login(ctx: StateContext<AuthenticationStateModel>, action: Login) {
  //   ctx.patchState({ loading: true })
  //   return this.authenticationService.login(action.payload).pipe(
  //     catchError(err => {
  //       console.error(err);
  //       return EMPTY;
  //     }),
  //     tap({
  //       next: loginResp => {
  //         ctx.patchState({
  //           token: loginResp.token,
  //           username: action.payload.username
  //         });
  //       },
  //       complete: () => {
  //         ctx.patchState({
  //           loading: false
  //         });
  //       }
  //     })
  //   );
  // }

  @Action(Login)
  async login(ctx: StateContext<AuthenticationStateModel>, action: Login) {
    ctx.patchState({ loading: true })
    try {
      const res = await firstValueFrom(this.authenticationService.login(action.payload));
      ctx.patchState({
        username: action.payload.username,
        token: res.token
      });
    }
    catch(err) {
      console.error(err);
    }
    finally {
      ctx.patchState({ loading: false });
    }
  }
}
