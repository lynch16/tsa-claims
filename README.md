# README

This application displays a set of graphs based on the 2010-2013 TSA claim data.  Different datasets from the TSA website can be loaded and rendered.  These datasets should all have .xls extensions. The views can be changed by selecting which keys to group by and filter.  The graphs and related statistics will update with all user settings. New claims can be added to the dataset. However, please note there is no backend saving this data.

# INSTALLATION

Dependencies can be loaded via Bower. Since there is no backend, the data is loaded via a simple XMLHTTPRequest. In order to prevent CORS errors when using locally, start a simple HTTP server (eg python -m SimpleHTTPServer).  Tabs, graphs and statistics will be displayed upon data load completion.

# CONTRIBUTIONS

Bug reports and pull requests are welcome on GitHub at https://github.com/lynch16/tsa-claims.git.

#LICENSE

The app is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
