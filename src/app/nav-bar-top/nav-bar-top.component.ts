import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nav-bar-top',
  templateUrl: './nav-bar-top.component.html',
  styleUrls: ['./nav-bar-top.component.css']
})
export class NavBarTopComponent implements OnInit {
  constructor(private route:ActivatedRoute,private auth:AuthService,private router:Router) { }
  public year;
  public sideNavOption;
  public isLoaded=false;
  ngOnInit() {
    this.sideNavOption = this.route.snapshot.params['sideNavOption'];
    this.year = this.route.snapshot.params['year'];
    this.isLoaded = true
  }

  Operations(year){
     this.router.navigate(['/operations/' + year + '1']);
  }

  Capture() {

    //let element = document.querySelector("#"+"this.dataType");
    // let element :string = "#"+"this.dataType";
    html2canvas(document.body).then(function (canvas) {
      // Convert the canvas to blob
      canvas.toBlob(function (blob) {
        // To download directly on browser default 'downloads' location
        let link = document.createElement("a");
        link.download = "image.png";
        link.href = URL.createObjectURL(blob);
        link.click();

        // To save manually somewhere in file explorer
        //FileSaver.saveAs(blob, 'image.png');

      }, 'image/png');
    });
  }

  LogOut(){
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
