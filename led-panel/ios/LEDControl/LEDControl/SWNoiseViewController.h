//
//  SWNoiseViewController.h
//  LEDControl
//
//  Created by Chad Berkley on 8/13/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface SWNoiseViewController : UIViewController
@property (weak, nonatomic) IBOutlet UISlider *redSlider;
@property (weak, nonatomic) IBOutlet UISlider *greenSlider;
@property (weak, nonatomic) IBOutlet UISlider *blueSlider;
@property (weak, nonatomic) IBOutlet UITextField *changeIntervalTextField;
@property (weak, nonatomic) IBOutlet UIButton *goButton;

@end
