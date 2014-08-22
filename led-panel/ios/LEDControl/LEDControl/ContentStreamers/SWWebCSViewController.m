//
//  SWWebCSViewController.m
//  LEDControl
//
//  Created by P. Mark Anderson on 8/20/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWWebCSViewController.h"

@interface SWWebCSViewController ()

@end

@implementation SWWebCSViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    self.webView = [[UIWebView alloc] initWithFrame:self.streamedContentArea.bounds];
    [self addContentView:self.webView];
    
    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/mbostock/raw/9539958/"]]];

}

- (IBAction)moreButtonWasTapped:(id)sender {
}

- (IBAction)closeButtonWasTapped:(id)sender {
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
}

@end
