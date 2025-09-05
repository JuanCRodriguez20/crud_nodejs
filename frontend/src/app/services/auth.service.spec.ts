import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: spy }
      ]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login user successfully', () => {
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          token: 'mock-token'
        }
      };

      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(credentials).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data?.user.email).toBe('test@example.com');
        expect(response.data?.token).toBe('mock-token');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);
    });
  });

  describe('register', () => {
    it('should register user successfully', () => {
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          token: 'mock-token'
        }
      };

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      service.register(userData).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data?.user.name).toBe('Test User');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(userData);
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should clear storage and navigate to login', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Test' }));

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is logged in', () => {
      const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
      (service as any).currentUserSubject.next(mockUser);

      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when user is not logged in', () => {
      (service as any).currentUserSubject.next(null);

      expect(service.isAuthenticated()).toBe(false);
    });
  });
});