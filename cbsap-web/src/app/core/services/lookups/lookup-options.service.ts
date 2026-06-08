import { Injectable } from '@angular/core';
import { EntityService, LookUpsService } from '@core/services/index';
//import { map, shareReplay } from 'rxjs';
import { map, shareReplay, switchMap, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LookupOptionsService {
  constructor(
    private entityService: EntityService,
    private lookUpService: LookUpsService

  ) {

    const raw = localStorage.getItem('sr');

    const role = raw! == null ? Number(raw) : null;

    if (!Number.isNaN(role) && role !== null) {
      this.roleID$.next(role);

    }

  }



  private entities$ = this.entityService.getAllEntities().pipe(shareReplay(1));
  readonly entityOptions$ = this.entities$.pipe(
    map((entities) =>
      entities.isSuccess
        ? [
          { label: '\u00A0', value: null },
          ...(entities.responseData ?? []).map((entity) => ({
            label: entity.entityName,
            value: entity.entityProfileID,
          })),
        ]
        : []
    ),
    shareReplay(1)
  );


  private roleID$ = new BehaviorSubject<number | null>(
    this.getInitialRole()
  );



  private getInitialRole(): number | null {
    const raw = localStorage.getItem('sr');



    if (!raw) return null;



    const cleaned = raw.trim().replace(/"/g, '');
    const role = Number(cleaned);



    return Number.isNaN(role) ? null : role;
  }



  setRoleID(roleID: number) {
    if (!roleID) return;



    localStorage.setItem('sr', roleID.toString());
    this.roleID$.next(roleID);
  }



  private entitiesByRole$ = this.roleID$.pipe(
    switchMap((roleID) => {
      if (!roleID) {
        return of({ isSuccess: false, responseData: [] });
      }



      return this.entityService.getAllEntitiesByRole(roleID);
    })
  );



  readonly entityOptionsByRole$ = this.entitiesByRole$.pipe(
    map((entities) =>
      entities.isSuccess
        ? [
          { label: '\u00A0', value: null },
          ...(entities.responseData ?? []).map((e) => ({
            label: e.entityName,
            value: e.entityProfileID,
          })),
        ]
        : []
    )
  );



  private accountsLookup$ = this.lookUpService
    .getAccountLookUps()
    .pipe(shareReplay(1));
  readonly accountsLookupOptions$ = this.accountsLookup$.pipe(
    map((accounts) =>
      accounts.isSuccess
        ? [
          { label: '\u00A0', value: null },
          ...(accounts.responseData ?? []).map((account) => ({
            label: account.accountName,
            value: account.accountID,
          })),
        ]
        : []
    ),
    shareReplay(1)
  );

  private invRoutingFlowLookUp$ = this.lookUpService
    .getInvRoutingFlowLookUps()
    .pipe(shareReplay(1));
  readonly invRoutingFlowLookUpOptions$ = this.invRoutingFlowLookUp$.pipe(
    map((routingFlows) =>
      routingFlows.isSuccess
        ? [
          { label: '\u00A0', value: null },
          ...(routingFlows.responseData ?? []).map((routingFlow) => ({
            label: routingFlow.invRoutingFlowName,
            value: routingFlow.invRoutingFlowID,
          })),
        ]
        : []
    ),
    shareReplay(1)
  );

  private taxCodeLookUp$ = this.lookUpService
    .getTaxCodeLookUps()
    .pipe(shareReplay(1));
  readonly taxCodeLookUpOptions$ = this.taxCodeLookUp$.pipe(
    map((taxcodes) =>
      taxcodes.isSuccess
        ? [
          { label: '\u00A0', value: null },
          ...(taxcodes.responseData ?? []).map((taxcode) => ({
            label: taxcode.taxCodeName,
            value: taxcode.taxCodeID,
          })),
        ]
        : []
    ),
    shareReplay(1)
  );


  private supplierLookUp$ = this.lookUpService
    .getSupplierLookUps()
    .pipe(shareReplay(1));
  readonly supplierLookUpOptions$ = this.supplierLookUp$.pipe(
    map((suppliers) =>
      suppliers.isSuccess
        ? [
          { label: '\u00A0', value: null },
          ...(suppliers.responseData ?? []).map((supplier) => ({
            label: supplier.supplierName,
            value: supplier.supplierInfoID,
          })),
        ]
        : []
    ),
    shareReplay(1)
  );

  private rolesLookUp$ = this.lookUpService
    .getRolesLookUps()
    .pipe(shareReplay(1));
  readonly rolesLookUpOptions$ = this.rolesLookUp$.pipe(
    map((roles) =>
      roles.isSuccess
        ? [
          { label: '\u00A0', value: null },
          ...(roles.responseData ?? []).map((role) => ({
            label: role.roleName,
            value: role.roleID,
          })),
        ]
        : []
    ),
    shareReplay(1)
  );

  private canBeAddedRolesLookUp$ = this.lookUpService
    .getCanBeAddedRolesLookUps()
    .pipe(shareReplay(1));
  readonly canBeAddedRolesLookUpOptions$ = this.canBeAddedRolesLookUp$.pipe(
    map((roles) =>
      roles.isSuccess
        ? [
          { label: '\u00A0', value: null },
          ...(roles.responseData ?? []).map((role) => ({
            label: role.roleName,
            value: role.roleID,
          })),
        ]
        : []
    ),
    shareReplay(1)
  );

}

