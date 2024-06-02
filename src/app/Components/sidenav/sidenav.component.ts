import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, AfterViewInit {
  
  mobileQuery: MediaQueryList;
  isExpanded: boolean = false;
  IdUsuario: number = 0;
  UserName: string = sessionStorage.getItem('user') || "----";
  NameUser: string = "Anonymous";
  Avatar: string = "";
  ShowSvg: boolean = true;
  isMobile: boolean = false;
  modeSide: string = "side";
  itemsMenu: any[] = [
    { separator: true },
    { id: 'miscuentas', label: 'Mis Cuentas', svg: '/assets/svg/beezky_menu_bank.svg', children: [
        { id: '1', label: 'Cuentas', link: 'account-summary', active: false },
        { id: '2', label: 'Detalle de Cuentas', link: 'client-accounts', active: false },
        { id: '3', label: 'Crear Cuentas', link: 'account-register', active: false },
        { id: '4', label: 'Crear Cliente', link: 'client-register', active: false },
      ], active: false
    },
    { separator: true },
    { id: 'transferir', label: 'Transferir', svg: '/assets/svg/beezky_menu_transfer.svg', children: [
        { id: '1', label: 'Entre Cuentas Propias', link: 'transfer-ownaccounts', active: false },
        { id: '2', label: 'Terceros Beezky Cash', link: 'transferencias', active: false },
        { id: '3', label: 'Banco Local', link: '_blank', active: false },
        { id: '4', label: 'Al Exterior', link: '_blank', active: false },
        { id: '5', label: 'Envío Beezky Cash', link: '_blank', active: false },
        { id: '6', label: 'Retiro de efectivo', link: '_blank', active: false },
      ], active: false
    },
    { separator: true },
    { id: 'pagar', label: 'Pagar', svg: '/assets/svg/beezky_menu_wallet.svg', children: [
        { id: '1', label: 'Servicios', link: '_blank', active: false },
        { id: '2', label: 'Pagar préstamo', link: '_blank', active: false },
        { id: '3', label: 'Préstamos de terceros', link: '_blank', active: false }
      ], active: false
    },
    { separator: true },
    { id: 'mistransacciones', label: 'Mis Transacciones', svg: '/assets/svg/beezky_menu_dollar.svg', children: [
        { id: '1', label: 'Favoritas', link: '_blank', active: false },
        { id: '2', label: 'Agendadas', link: '_blank', active: false },
        { id: '3', label: 'Histórico', link: '_blank', active: false }
      ], active: false
    },
    { separator: true }
  ]

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    media: MediaMatcher,
    private sanitizer: DomSanitizer
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    
  }
  ngAfterViewInit(): void {
    this.noShowIconButton();
  }

  ngOnInit(): void {
      const firstName = sessionStorage.getItem('firstname') || '';
      const lastName = sessionStorage.getItem('lastname') || '';
      this.NameUser = `${firstName} ${lastName}`;
      this.Avatar = sessionStorage.getItem('avatar') || '';
      this.ShowSvg = !this.Avatar;

      // Observa el cambio en el tamaño de la pantalla
      this.breakpointObserver
        .observe([Breakpoints.XSmall, Breakpoints.Small])
        .subscribe(result => {
          this.isMobile = result.matches;
          if (this.isMobile) {
            this.isExpanded = true;
          }
      });
  }

  expanded(drawer: MatSidenav){
    
    if (this.isMobile) {
      this.isExpanded = true;
      drawer.toggle();
    }
    else {
      this.isExpanded = !this.isExpanded;
    }
    this.noShowIconButton();
  }
  
  sanitizeSvg(svgData: string): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(svgData);
  }

  showSubMenu(panelId: string, Expand: boolean = true) {
    const panel: HTMLElement | null = document.getElementById(panelId)!;
    if (panel) {
        const boton = panel.parentElement?.querySelector('.p-panel-toggler') as HTMLButtonElement | null;
        boton?.click();
        this.isExpanded = Expand;
        this.noShowIconButton();
    }
  }

  onClickSubItem(drawer: MatSidenav, buttonId?: string, activeId?: string){
    if (this.isMobile) {
      drawer.close();
    }
    
    if (buttonId && activeId) {
      this.setActive(buttonId, activeId);
    }
  }

  setActive(id: string, childId: string) {
    this.setInactive();

    const mainItem = this.itemsMenu.find((item: { id: string }) => item.id === id);
    const child = mainItem?.children?.find((item: { id: string }) => item.id === childId);
    if (child) {
      mainItem.active = true;
      child.active = true;
      this.showSubMenu(id, false);
    }
  }

  setInactive() {
    this.itemsMenu.forEach((item: { active: boolean, children?: Array<{ active: boolean }> }) => {
      item.active = false;
      if (item.children) {
        item.children.forEach((subItem: { active: boolean }) => subItem.active = false);
      }
    });
  }

  noShowIconButton() {
    // Obtén todos los botones por su clase
    const divs = document.querySelectorAll('.p-panel-icons-end') as NodeListOf<HTMLDivElement>;

    // Verifica si se encontraron botones
    if (divs.length > 0) {
      // Itera sobre cada botón y aplica el estilo CSS
      divs.forEach((div) => {
        if (this.isExpanded) {
          div.style.display = 'block';
        }
        else {
          div.style.display = 'none';
        }
      });
    } else {
      console.error('No se encontraron divs con la clase especificada.');
    }
  }

  onLogout(){
    sessionStorage.clear();
    location.reload();
  }
  
}
