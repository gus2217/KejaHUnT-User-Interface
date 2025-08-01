import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingResponse } from 'src/app/features/unit/booking-preview/models/booking-response.model';
import { BookingService } from 'src/app/features/unit/booking-preview/services/booking.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showBookingButton = false;
  bookingReference: string = '';
  searchQuery: string = '';
  searchType: string = 'buy';
  isMobileMenuOpen = false;

  constructor(private bookingService: BookingService, private router: Router) {}

  ngOnInit(): void {
    this.bookingService.getAllBookings().subscribe({
      next: (bookings: BookingResponse[]) => {
        const pendingBooking = bookings.find(b => !b.status || b.status === 'Pending');
        if (pendingBooking) {
          this.showBookingButton = true;
          this.bookingReference = pendingBooking.bookingReference;
        }
      },
      error: () => {
        this.showBookingButton = false;
      }
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
