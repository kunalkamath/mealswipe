//
//  ViewController2.m
//  mealswipe
//
//  Created by Esha Maharishi on 4/11/15.
//  Copyright (c) 2015 EAAA. All rights reserved.
//

#import "ViewController2.h"

@interface ViewController2 ()

@end

@implementation ViewController2

- (void)viewDidLoad {
    [super viewDidLoad];
    
    _scoreLabel = [ [UILabel alloc ] initWithFrame:CGRectMake((self.view.bounds.size.width / 2), 0.0, 150.0, 43.0) ];
    _scoreLabel.textColor = [UIColor whiteColor];
    _scoreLabel.backgroundColor = [UIColor redColor];
    _scoreLabel.font = [UIFont fontWithName:@"Arial Rounded MT Bold" size:(36.0)];
    [self.view addSubview:_scoreLabel];
    _scoreLabel.text = [NSString stringWithFormat: @"%d", 0];
    // Do any additional setup after loading the view.

    NSMutableDictionary *mutableDictionary = [[NSMutableDictionary alloc] init];
    
    NSMutableString *urls = [[NSMutableString alloc]init];
    [urls appendString:@"http://localhost:3000/active"];
    NSURL* url = [NSURL URLWithString:urls];
    NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:url];
    request.HTTPMethod = @"GET";
    
    NSData* data = [NSJSONSerialization dataWithJSONObject:mutableDictionary options:0 error:NULL];
    request.HTTPBody = data;
    
    [request addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
    NSURLSessionConfiguration* config = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession* session = [NSURLSession sessionWithConfiguration:config];
    
    NSURLSessionDataTask* dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (error) {
            NSLog(@"error in nsurl sending");
            NSLog(@"%@",[error localizedDescription]);
        }
        else {

            NSLog(@"Sent new user");
            NSArray* responseArray = [NSJSONSerialization JSONObjectWithData:data options:0 error:NULL];
            NSLog(@"array: %@", responseArray);
            
            NSMutableArray *mainArray = [NSMutableArray array];
            
            /*
            for(int i = 0; i < 5; i++)
            {
                NSMutableArray *subArray = [[NSMutableArray alloc] initWithCapacity:5];
                
                for(int j = 0; j < 4; j++)
                {
                    UILabel *label = [[UILabel alloc] init];
                initWithFrame:CGRectMake((self.view.bounds.size.width / 2), 0.0, 150.0, 43.0) ];
                    _scoreLabel.textAlignment =  UITextAlignmentCenter;
                    _scoreLabel.textColor = [UIColor whiteColor];
                    _scoreLabel.backgroundColor = [UIColor redColor];
                    _scoreLabel.font = [UIFont fontWithName:@"Arial Rounded MT Bold" size:(36.0)];
                    [self.view addSubview:_scoreLabel];
                    _scoreLabel.text = [NSString stringWithFormat: @"%d", 0];
                    [subArray addObject:label];
                    [label release];
                }
                [mainArray addObject:subArray];
                [subArray release];
            }
            
             */
        }

    }];
    [dataTask resume];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
