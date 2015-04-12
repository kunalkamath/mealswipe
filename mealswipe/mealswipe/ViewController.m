//
//  ViewController.m
//  mealswipe
//
//  Created by Esha Maharishi on 4/11/15.
//  Copyright (c) 2015 EAAA. All rights reserved.
//

#import "ViewController.h"
#import <Foundation/NSJSONSerialization.h>
#import <CoreLocation/CoreLocation.h>

@interface ViewController()
@property (assign, nonatomic) CLLocation *loc;
@property (nonatomic, strong) CLLocationManager *locationManager;
@end

@implementation ViewController

@synthesize nameLabel, phoneLabel, emailLabel, nameText, phoneText, emailText;

- (void)viewDidLoad {
    [super viewDidLoad];
    NSLog(@"in view did load");

    // set up location services
    if ([CLLocationManager locationServicesEnabled]) {
        
        if([CLLocationManager authorizationStatus]==kCLAuthorizationStatusDenied){
            NSLog(@"fuck you");
        }
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.delegate = self;
        self.locationManager.desiredAccuracy=kCLLocationAccuracyBest;
        self.locationManager.distanceFilter=kCLDistanceFilterNone;
        [self.locationManager requestAlwaysAuthorization];
//        [self.locationManager startMonitoringSignificantLocationChanges];
        [self.locationManager startUpdatingLocation];
        NSLog(@"Location services are enabled");
    } else {
        NSLog(@"Location services are not enabled");
    }
}

int FLAG = 0;

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations
{
    _loc =[locations lastObject];
    // NSLog(@" NAGU %@", [locations lastObject]);
    
    float xcoord =_loc.coordinate.latitude;
    float ycoord = _loc.coordinate.longitude;
    NSNumber *x = [NSNumber numberWithFloat:xcoord];
    NSNumber *y = [NSNumber numberWithFloat:ycoord];
    
    NSLog(@"x: %f", [x floatValue]);
    NSLog(@"y: %f", [y floatValue]);
}


- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
}

- (IBAction)button:(id)sender {
    NSLog(@"button pressed");

    NSMutableDictionary *mutableDictionary = [[NSMutableDictionary alloc] init];
    
    NSString *name = nameText.text;
    NSString *phone = phoneText.text;
    NSString *email = emailText.text;
    
    NSMutableString *urls = [[NSMutableString alloc]init];
    [urls appendString:@"http://localhost:3000/register/:"];
    [urls appendString:name];
    [urls appendString:@"/:"];
    [urls appendString:phone];
    [urls appendString:@"/:"];
    [urls appendString:email];
    NSURL* url = [NSURL URLWithString:urls];
    NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:url];
    request.HTTPMethod = @"POST";
    
    NSData* data = [NSJSONSerialization dataWithJSONObject:mutableDictionary options:0 error:NULL];
    request.HTTPBody = data;
    
    [request addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
    NSURLSessionConfiguration* config = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession* session = [NSURLSession sessionWithConfiguration:config];
    
    NSURLSessionDataTask* dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (!error) {
            NSLog(@"Sent new user");
        }
        else {
            NSLog(@"error in nsurl sending");
            NSLog(@"%@",[error localizedDescription]);
        }
    }];
    [dataTask resume];
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)register:(id)sender {
}
@end
