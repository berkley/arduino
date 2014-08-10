//
//  SWSlideshowCSViewController.m
//  LEDControl
//
//  Created by P. Mark Anderson on 8/9/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWSlideshowCSViewController.h"

@interface SWSlideshowCSViewController ()

@end

@implementation SWSlideshowCSViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    UIImageView *iv = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"gradient.png"]];
    
    [self addContentView:iv];
}

@end
