//
//  ViewController.h
//  mealswipe
//
//  Created by Esha Maharishi on 4/11/15.
//  Copyright (c) 2015 EAAA. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ViewController : UIViewController {

}

@property (weak, nonatomic) IBOutlet UILabel *nameLabel;
@property (weak, nonatomic) IBOutlet UILabel *phoneLabel;
@property (weak, nonatomic) IBOutlet UILabel *emailLabel;
@property (weak, nonatomic) IBOutlet UITextField *nameText;
@property (weak, nonatomic) IBOutlet UITextField *phoneText;
@property (weak, nonatomic) IBOutlet UITextField *emailText;
- (IBAction)register:(id)sender;

@end