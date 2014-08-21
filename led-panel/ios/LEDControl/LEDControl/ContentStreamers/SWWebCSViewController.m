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

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

- (IBAction)moreButtonWasTapped:(id)sender {
}

- (IBAction)closeButtonWasTapped:(id)sender {
    [self dismissViewControllerAnimated:YES completion:nil];
}
@end
